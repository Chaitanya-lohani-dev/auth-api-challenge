import jwt from 'jsonwebtoken';

export const verify = async(token) => {
    const verified = await jwt.verify(token, process.env.REFRESH_TOKEN_SECREAT)

    return verified
}