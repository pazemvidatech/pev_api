import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import CreateRenegotiationController from '../controllers/CreateRenegotiationController'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindRenegotiationsCustomerController from '../controllers/FindRenegotiationsCustomerController'
import DeleteRenegotiationController from '../controllers/DeleteRenegotiationController'

const renegotiationRoutes = Router()
const createRenegotiationController = new CreateRenegotiationController()
const findRenegotiationsCustomerController = new FindRenegotiationsCustomerController()
const deleteRenegotiationController = new DeleteRenegotiationController()

renegotiationRoutes.use(ensureAdmin)

renegotiationRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().uuid().required(),
      negotiator: Joi.string().required(),
    },
  }),
  createRenegotiationController.handle,
)

renegotiationRoutes.get(
  '/customer/:customerId',
  ensureAdmin,
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  findRenegotiationsCustomerController.handle,
)

renegotiationRoutes.delete(
  '/:renegotiationId',
  ensureAdmin,
  celebrate({
    [Segments.PARAMS]: {
      renegotiationId: Joi.string().uuid().required(),
    },
  }),
  deleteRenegotiationController.handle,
)

export default renegotiationRoutes
