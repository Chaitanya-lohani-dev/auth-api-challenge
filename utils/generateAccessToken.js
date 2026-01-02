import jwt from "jsonwebtoken";

export default generatAaccessToken = async (user) => {
    const accessToken = await jwt.sign(
        {
            "_id" : user._id,
            "email": user.email,
            "role" : user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15min'
        }
    )

    return accessToken
}
