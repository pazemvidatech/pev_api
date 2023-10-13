import { Router } from 'express'

import SignInController from '../../http/controllers/SignInController'
import RefreshTokenController from '../../http/controllers/RefreshTokenController'
import { celebrate, Segments, Joi } from 'celebrate'

const authenticateRoutes = Router()

const signInController = new SignInController()
const refreshTokenController = new RefreshTokenController()

authenticateRoutes.post(
  '/signin',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    },
  }),
  signInController.handle,
)

authenticateRoutes.post(
  '/refresh-token',
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string().required(),
    },
  }),
  refreshTokenController.handle,
)

export default authenticateRoutes
