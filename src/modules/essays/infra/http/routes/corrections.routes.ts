import { Router } from 'express'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import CreateCorrectionController from '../controllers/CreateCorrectionController'
import { celebrate, Segments, Joi } from 'celebrate'

const correctionsRoutes = Router()
const createCorrectionController = new CreateCorrectionController()

correctionsRoutes.use(ensureAdmin)

correctionsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      essayId: Joi.string().uuid().required(),
    },
  }),
  createCorrectionController.handle,
)

export default correctionsRoutes
