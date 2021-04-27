import * as bcrypt from 'bcrypt'

const hashPassword = (password: string) => (
    bcrypt.hash(password, parseInt(process.env.HASH_ROUNDS))
)

const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)


export {
    hashPassword,
    verifyPassword,
}
