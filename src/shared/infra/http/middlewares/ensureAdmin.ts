import { Response, Request, NextFunction } from 'express'
import AuthenticationProvider from '@shared/container/providers/AuthenticationProvider/implementations/CognitoProvider'

import AppError from '@shared/errors/AppError'

const ensureAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authorization.split(' ')

  const authenticationProvider = new AuthenticationProvider()

  try {
    const user = await authenticationProvider.verifyToken(token)

    if (!user.isAdmin) throw new AppError('Invalid token', 401)

    req.account = user
    req.accessToken = token

    next()
  } catch (err) {
    throw new AppError('Invalid token', 401)
  }
}

export default ensureAdmin
