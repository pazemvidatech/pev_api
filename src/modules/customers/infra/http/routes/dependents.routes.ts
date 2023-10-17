import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import CreateDependentController from '../controllers/CreateDependentController'
import { Joi, Segments, celebrate } from 'celebrate'
import DeleteDependentController from '../controllers/DeleteDependentController'

const createDependentUseCase = new CreateDependentController()
const deleteDependentController = new DeleteDependentController()

const dependentsRoutes = Router()

dependentsRoutes.use(ensureAdmin)

dependentsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
      deathDate: Joi.date().optional(),
      customerId: Joi.string().uuid().required(),
    },
  }),
  createDependentUseCase.handle,
)

dependentsRoutes.delete(
  '/:dependentId',
  celebrate({
    [Segments.PARAMS]: {
      dependentId: Joi.string().uuid().required(),
    },
  }),
  deleteDependentController.handle,
)

export default dependentsRoutes
