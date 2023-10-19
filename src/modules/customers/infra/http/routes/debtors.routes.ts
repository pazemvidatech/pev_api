import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindAllDebtorsController from '../controllers/FindAllDebtorsController'
import { Joi, Segments, celebrate } from 'celebrate'
import { arraySorts } from '../../../types/SortQueryType'
import ShowDebtorController from '../controllers/ShowDebtorController'

const showDebtorController = new ShowDebtorController()
const findAllDebtorsController = new FindAllDebtorsController()

const debtorsRoutes = Router()

debtorsRoutes.use(ensureAdmin)

debtorsRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().optional(),
      sort: Joi.string()
        .valid(...arraySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(30),
    }).unknown(false),
  }),
  findAllDebtorsController.handle,
)

debtorsRoutes.get(
  '/:debtorId',
  celebrate({
    [Segments.PARAMS]: {
      debtorId: Joi.string().uuid().required(),
    },
  }),
  showDebtorController.handle,
)

export default debtorsRoutes
