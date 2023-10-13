import { Router } from 'express'
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated'
import { arrayEssaySorts } from '../../../types/EssaySortQueryType'
import CreateEssayController from '../controllers/CreateEssayController'
import FindAllEssaysByAccountController from '../controllers/FindAllEssaysByAccount'
import { celebrate, Segments, Joi } from 'celebrate'
import EssayStatusEnum from '@modules/essays/enums/EssayStatusEnum'
import ShowEssayController from '../controllers/ShowEssayController'
import uploadConfig from '@config/upload'
import multer from 'multer'
import CreateDraftController from '../controllers/CreateDraftController'
import ConfirmDraftController from '../controllers/ConfirmDraftController'

const uploadAvatar = multer(uploadConfig)

const essayRoutes = Router()
const showEssayController = new ShowEssayController()
const createEssayController = new CreateEssayController()
const createDraftController = new CreateDraftController()
const confirmDraftController = new ConfirmDraftController()
const findAllEssaysByAccount = new FindAllEssaysByAccountController()

essayRoutes.use(ensureAuthenticated)

essayRoutes.post(
  '/image',
  uploadAvatar.single('image'),
  celebrate({
    [Segments.BODY]: {
      theme: Joi.string().min(12).max(100).required(),
    },
  }),
  createDraftController.handle,
)

essayRoutes.put(
  '/image/confirm/:essayId',
  celebrate({
    [Segments.BODY]: {
      theme: Joi.string().min(12).max(100).required(),
      text: Joi.string().min(1200).max(5000).required(),
      isFour: Joi.boolean().optional().default(false),
    },
    [Segments.PARAMS]: {
      essayId: Joi.string().uuid().required(),
    },
  }),
  confirmDraftController.handle,
)

essayRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      theme: Joi.string().min(12).max(100).required(),
      text: Joi.string().min(1200).max(5000).required(),
      isFour: Joi.boolean().optional().default(false),
    },
  }),
  createEssayController.handle,
)

essayRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      sort: Joi.string()
        .valid(...arrayEssaySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(10),
      status: Joi.string()
        .valid(...Object.values(EssayStatusEnum))
        .optional(),
    }).unknown(false),
  }),
  findAllEssaysByAccount.handle,
)

essayRoutes.get(
  '/:essayId',
  celebrate({
    [Segments.PARAMS]: {
      essayId: Joi.string().uuid().required(),
    },
  }),
  showEssayController.handle,
)

export default essayRoutes
