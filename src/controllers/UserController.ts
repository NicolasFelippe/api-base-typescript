import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository'
import { verifyPassword } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { logger } from '../utils/wintons';
import { RequestModel } from './../middleware/RequestModel';

class UserController {

    constructor() {
        
    }

    async create(request: RequestModel, response: Response) {
        try {
            const { email, password } = request.body;
            const userRepository = getCustomRepository(UserRepository)
            const user = userRepository.create({
                email,
                password
            })
            await userRepository.save(user);

            return response.json(user)

        } catch (error) {
            logger.error('UserController: create  ERROR: ', error)
            return response.status(500).send('server error')
        }
    }


    async authenticate(request: RequestModel, response: Response) {
        try {
            const { email, password } = request.body
            if (!email || !password) {
                response.status(400)
                    .send('Empty request body.')
                return
            }
            const userRepository = getCustomRepository(UserRepository)
            const user = await userRepository.findOne({
                where: {
                    email
                }
            })
            if (!user) {
                response.status(404)
                    .send('Resource not found.')

                return
            }

            const validPassword = await verifyPassword(
                password, user.password)
            if (validPassword) {
                const token = generateToken({
                    email
                })
                user.password = null;
                response.cookie(
                    process.env.JWT_COOKIE,
                    token, {
                    httpOnly: true,
                    maxAge: parseInt(process.env.JWT_EXPIRES_IN, 10) * 1000
                }
                ).send(user)

                return
            }

            response.status(403)
                .send('Forbidden access')

        } catch (error) {
            logger.error(error)
            response.status(500)
                .send('Internal server error.')
        }
    }

    async logout(request: RequestModel, response: Response) {
        response.clearCookie('token')
            .send('Authentication required.')
    }


    async authenticatedUser(request: RequestModel, response: Response) {
        const user = {
            ...request.auth
        }

        response.send(user)
    }
}
export { UserController }