import jwt from 'jsonwebtoken';


export default function generateRefreshToken(userId) {
    return jwt.sign(
        {
            "userId": userId
        },
        process.env.REFRESH_TOKEN_SECREAT,
        {
            expiresIn: '7d'
        }
    )
}