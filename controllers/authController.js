import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import generateAccessToken from '../utils/generateaccesstoken.js';
import generateRefreshToken from '../utils/generaterefreshToken.js';
import { verify } from '../utils/verifyRefreshToken.js';
import crypto from "crypto";

const secureOptions = { secure: false,httpOnly: false };

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    role: z.string(),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const register = async (req, res) => {
    
    try {
        
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        let { name, email, password, role } = validation.data;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email Already Registered ' });
        }

        const hassedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hassedPassword , role});
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: "Invalid Credentails" });
        }

        const { email, password } = validation.data;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid Credentails" });
        }
        
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user._id)
        
        const hashedRefreshToken = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

        await User.findByIdAndUpdate(
            user._id,
            { refreshToken: hashedRefreshToken},
            {new : true}
        )
        return res.status(200)
        .cookie("refreshToken", refreshToken, secureOptions)
        .json({"accessToken": accessToken })
    } 
    catch (error) {
        return res.status(500).json({ error: "Server error" });
  }
}

export const logout = async(req, res) => {
    try {
        const userRefreshToken = await  req.cookies.refreshToken
    
        if (!userRefreshToken) {
            returnres.status(403).json("Unauthorized")
        }
    
        const decoded = await verify(userRefreshToken)
        const { userId } = decoded
    
        await User.findByIdAndUpdate(
            userId,
            {refreshToken: undefined}
        )
    
        return res.status(200)
        .clearCookie("refreshToken")
        .clearCookie('accesstoken')
        .json("User Loged Out succesfully")
    } catch (error) {
        returnres.status(500).json("Internal Server Error")
    }
}

export const refresh = async(req, res) => {
    try {
        const userRefreshToken = await req.cookies.refreshToken;
    
        if (!userRefreshToken) {
            return res.status(403).json("Foorbiden Invalid Refresh Token")
        }
        const hashedIncomingToken = crypto
      .createHash("sha256")
      .update(userRefreshToken)
      .digest("hex");
        const decoded = await verify(userRefreshToken)
        
        const { userId }  = decoded;
    
        const user = await User.findOne({ _id: userId })
        
    
        if (hashedIncomingToken != user.refreshToken) {
            return res.status(400).json('Unauthorized')
        }
    
        const newAccessToken = await generateAccessToken(user)
        const newRefreshToken = await generateRefreshToken(user._id)
        
        const hashedRefreshToken = crypto
  .createHash("sha256")
  .update(newRefreshToken)
  .digest("hex");
        await User.findByIdAndUpdate(
            userId,
            {refreshToken: hashedRefreshToken},
            {new : true}
        );
    
        return res.status(200)
        .cookie("refreshToken", newRefreshToken, secureOptions)
        .json({"accessToken": newAccessToken})
    } catch (error) {
        return res.status(500).json("Internal Server Error!")
    }
}