import jwt from 'jsonwebtoken';


export default generateRefreshToken = async (userId) => {
    const refreshToken = await jwt.sign(
        {
            "userId": userId
        },
        process.env.REFRESH_TOKEN_SECREAT,
        {
            expiresIn: '7d'
        }
    )

    return refreshToken
}