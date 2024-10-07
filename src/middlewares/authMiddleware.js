require('dotenv').config()
const { verifyToken } = require('../providers/JwtProvider');


const isAuthorized = async (req, res, next) => {
    const accessTokenFromCookie = req.cookies.accessToken

    if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Unauthorized! (Token not found)' })
        return
    }

    try {
        const accessTokenDecoded = await verifyToken(
            accessTokenFromCookie,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE
        )

        req.jwtDecoded = accessTokenDecoded

        next();

    } catch (error) {

        if (error.message?.includes('jwt expired')) {
            res.status(411).json({ message: 'Need to reset token.' })
            return
        }

        res.status(401).json({ message: 'Unauthorized! please login' })
    }
}

module.exports = {
    isAuthorized
}