import { Router } from 'express'

import { celebrate, Segments, Joi } from 'celebrate'

import ResetPasswordController from '../controllers/ResetPasswordController'
import ForgotPasswordController from '../controllers/ForgotPasswordController'
import regex from '@config/constants/regex'
import ChangePasswordController from '../controllers/ChangePasswordController'
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated'

const passwordRoutes = Router()
const resetPasswordController = new ResetPasswordController()
const forgotPasswordController = new ForgotPasswordController()
const changePasswordController = new ChangePasswordController()

passwordRoutes.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().trim().regex(regex.password).required(),
      code: Joi.string().trim().regex(regex.code).required(),
    },
  }),
  resetPasswordController.handle,
)

passwordRoutes.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
    },
  }),
  forgotPasswordController.handle,
)

passwordRoutes.post(
  '/change',
  celebrate({
    [Segments.BODY]: {
      oldPassword: Joi.string().trim().required(),
      newPassword: Joi.string().trim().regex(regex.password).required(),
    },
  }),
  ensureAuthenticated,
  changePasswordController.handle,
)

export default passwordRoutes
