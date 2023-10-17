import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import CreatePaymentController from '../controllers/CreatePaymentController'
import DeletePaymentController from '../controllers/DeletePaymentController'
import FindAllPaymentsController from '../controllers/FindAllPaymentsController'
import { arraySorts } from '@modules/payments/types/SortQueryType'
import ensureSeller from '@shared/infra/http/middlewares/ensureSeller'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindAllPaymentsFilterSellerController from '../controllers/FindAllPaymentsFilterSellerController'

const paymentRoutes = Router()
const createPaymentController = new CreatePaymentController()
const deletePaymentController = new DeletePaymentController()
const findAllPaymentsController = new FindAllPaymentsController()
const findAllPaymentsFilterSellerController = new FindAllPaymentsFilterSellerController()

paymentRoutes.get(
  '/',
  ensureAdmin,
  celebrate({
    [Segments.QUERY]: Joi.object({
      sort: Joi.string()
        .valid(...arraySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(10),
      accountId: Joi.string().uuid().optional(),
    }).unknown(false),
  }),
  findAllPaymentsController.handle,
)

paymentRoutes.get(
  '/filterSeller',
  ensureSeller,
  celebrate({
    [Segments.QUERY]: Joi.object({
      sort: Joi.string()
        .valid(...arraySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(10),
    }).unknown(false),
  }),
  findAllPaymentsFilterSellerController.handle,
)

paymentRoutes.use(ensureSeller)

paymentRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().uuid().required(),
      quantity: Joi.number().optional().default(1),
    },
  }),
  createPaymentController.handle,
)

paymentRoutes.delete(
  '/:paymentId',
  celebrate({
    [Segments.PARAMS]: {
      paymentId: Joi.string().uuid().required(),
    },
  }),
  deletePaymentController.handle,
)

export default paymentRoutes
