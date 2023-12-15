import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindAllPreferencesController from '../controllers/FindAllPreferencesController'
import UpdatePreferencesController from '../controllers/UpdatePreferencesController'
import { Joi, Segments, celebrate } from 'celebrate'

const findPreferencesCustomerController = new FindAllPreferencesController()
const updatePreferencesController = new UpdatePreferencesController()

const preferenceSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives()
    .try(Joi.string(), Joi.boolean(), Joi.number())
    .required(),
  description: Joi.string().required(),
  type: Joi.string().valid('NUMBER', 'AMOUNT', 'STRING').required(),
})

const preferencesRoutes = Router()

preferencesRoutes.use(ensureAdmin)

preferencesRoutes.get('/', findPreferencesCustomerController.handle)

preferencesRoutes.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.array().items(preferenceSchema).min(1),
  }),
  updatePreferencesController.handle,
)

export default preferencesRoutes
