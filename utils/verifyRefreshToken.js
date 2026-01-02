import jwt from 'jsonwebtoken';

export const verify = async(token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECREAT)
}