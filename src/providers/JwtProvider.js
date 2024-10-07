const JWT = require('jsonwebtoken');

const generateToken = async (userInfo, secretSignature, tokenline) => {
    try {

        return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenline })
    } catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async (token, secretSignature) => {
    try {
        return JWT.verify(token, secretSignature)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    generateToken,
    verifyToken,
}