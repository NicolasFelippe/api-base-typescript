import * as jwt from 'jsonwebtoken'

const generateToken = (payload: any) => jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
        issuer: process.env.JWT_ISSUER,
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10)
    }
)

const decodeToken = (token: string): any => {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET,
            { issuer: process.env.JWT_ISSUER }
        )
    } catch (error) {
        return null
    }
}

export {
    generateToken,
    decodeToken,
}
