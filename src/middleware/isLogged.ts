import { decodeToken } from '../utils/jwt'
import { Response } from 'express';
import { UserRepository } from '../repositories/UserRepository'
import { getCustomRepository } from 'typeorm';
import { RequestModel } from './RequestModel';
import { logger } from '../utils/wintons';

const isLogged = async (req: RequestModel, res: Response, next) => {
  try {
    let { token } = req.cookies

    if (!token) {
      token = req.query.token
    }
    const teste = decodeToken(token)
    const { email } = decodeToken(token)
    console.log('middleware is logged teste: ', teste)
    if (email) {
      const settingsRepository = getCustomRepository(UserRepository);
      const user = await settingsRepository.findOne({ where: { email } })
      if (user) {
        req.auth = user
        next()

        return
      }
    }


    throw 'Invalid token'
  } catch (error) {
    logger.error(error)
    res.status(401)
      .clearCookie('token')
      .send('Authentication required.')
  }
}
export { isLogged }