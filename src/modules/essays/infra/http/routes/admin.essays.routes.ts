import { Router } from 'express'
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated'
import { arrayEssaySorts } from '../../../types/EssaySortQueryType'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import DeleteEssayController from '../controllers/DeleteEssayController'
import FindAllEssaysController from '../controllers/FindAllEssaysController'
import UpdateStatusEssayController from '../controllers/UpdateStatusEssayController'
import { celebrate, Segments, Joi } from 'celebrate'
import EssayStatusEnum from '@modules/essays/enums/EssayStatusEnum'

const essayRoutes = Router()
const deleteEssayController = new DeleteEssayController()
const findAllEssaysController = new FindAllEssaysController()
const updateStatusEssayController = new UpdateStatusEssayController()

essayRoutes.use(ensureAuthenticated)
essayRoutes.use(ensureAdmin)

essayRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      sort: Joi.string()
        .valid(...arrayEssaySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(10),
      status: Joi.string()
        .valid(...Object.values(EssayStatusEnum))
        .optional(),
      accountId: Joi.string().uuid().optional(),
    },
  }),
  findAllEssaysController.handle,
)

essayRoutes.patch(
  '/:essayId/status',
  celebrate({
    [Segments.PARAMS]: {
      essayId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      newStatus: Joi.string()
        .valid(...Object.values(EssayStatusEnum))
        .required(),
    },
  }),
  updateStatusEssayController.handle,
)

essayRoutes.delete(
  '/:essayId',
  celebrate({
    [Segments.PARAMS]: {
      essaId: Joi.string().uuid().required(),
    },
  }),
  deleteEssayController.handle,
)

export default essayRoutes
