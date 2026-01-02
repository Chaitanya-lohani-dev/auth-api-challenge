import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
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

        let { name, email, password } = validation.data;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email Already Registered ' });
        }

        const hassedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hassedPassword });
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
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ token });
    } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
