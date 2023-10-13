import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import CreateSubscriptionController from '../controllers/CreateSubscriptionController'
import DeleteSubscriptionController from '../controllers/DeleteSubscriptionController'
import FindAllSubscriptionsController from '../controllers/FindAllSubscriptionsController'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'

const subscriptionRoutes = Router()
const createSubscriptionController = new CreateSubscriptionController()
const deleteSubscriptionController = new DeleteSubscriptionController()
const findAllSubscriptionsController = new FindAllSubscriptionsController()

subscriptionRoutes.use(ensureAdmin)

subscriptionRoutes.get('/', findAllSubscriptionsController.handle)

subscriptionRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      accountId: Joi.string().uuid().required(),
      name: Joi.string().required(),
      expireAt: Joi.date().required(),
    },
  }),
  createSubscriptionController.handle,
)

subscriptionRoutes.delete(
  '/:subscription_id',
  celebrate({
    [Segments.PARAMS]: {
      subscription_id: Joi.string().uuid().required(),
    },
  }),
  deleteSubscriptionController.handle,
)

export default subscriptionRoutes
