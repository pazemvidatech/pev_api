import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import CreatePartnerController from '../controllers/CreatePartnerController'
import FindAllPartnersController from '../controllers/FindAllPartnersController'
import { Joi, Segments, celebrate } from 'celebrate'
import { arraySorts } from '../../../types/SortQueryType'
import DeletePartnerController from '../controllers/DeletePartnerController'

const createPartnerUseCase = new CreatePartnerController()
const findAllPartnersController = new FindAllPartnersController()
const deletePartnerController = new DeletePartnerController()

const partnerRoutes = Router()

partnerRoutes.use(ensureAdmin)

partnerRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      username: Joi.string().trim().required(),
      role: Joi.number().min(1).max(4).required(),
    },
  }),
  createPartnerUseCase.handle,
)

partnerRoutes.get(
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
  findAllPartnersController.handle,
)

partnerRoutes.delete(
  '/:accountId',
  celebrate({
    [Segments.PARAMS]: {
      accountId: Joi.string().uuid().required(),
    },
  }),
  deletePartnerController.handle,
)

export default partnerRoutes
