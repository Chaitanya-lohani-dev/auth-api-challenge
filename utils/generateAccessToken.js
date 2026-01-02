import jwt from "jsonwebtoken";

export default function generateAccessToken(user) {
    return jwt.sign(
        {
            "_id" : user._id,
            "email": user.email,
            "role" : user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )
}
