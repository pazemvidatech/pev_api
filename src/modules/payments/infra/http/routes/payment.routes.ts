import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import CreatePaymentController from '../controllers/CreatePaymentController'
import DeletePaymentController from '../controllers/DeletePaymentController'
import FindAllPaymentsController from '../controllers/FindAllPaymentsController'
import { arraySorts } from '@modules/payments/types/SortQueryType'
import ensureSeller from '@shared/infra/http/middlewares/ensureSeller'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindPaymentsCustomerController from '../controllers/FindPaymentsCustomerController'
import ShowPaymentController from '../controllers/ShowPaymentController'

const paymentRoutes = Router()
const showPaymentController = new ShowPaymentController()
const createPaymentController = new CreatePaymentController()
const deletePaymentController = new DeletePaymentController()
const findAllPaymentsController = new FindAllPaymentsController()
const findPaymentsCustomerController = new FindPaymentsCustomerController()

paymentRoutes.get(
  '/',
  ensureSeller,
  celebrate({
    [Segments.QUERY]: Joi.object({
      sort: Joi.string()
        .valid(...arraySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(10),
      month: Joi.number().min(1).max(12).optional(),
      year: Joi.number().min(2023).optional(),
      accountId: Joi.string().uuid().optional(),
    }).unknown(false),
  }),
  findAllPaymentsController.handle,
)

paymentRoutes.get(
  '/:paymentId',
  ensureSeller,
  celebrate({
    [Segments.PARAMS]: {
      paymentId: Joi.string().uuid().required(),
    },
  }),
  showPaymentController.handle,
)

paymentRoutes.delete(
  '/:paymentId',
  ensureAdmin,
  celebrate({
    [Segments.PARAMS]: {
      paymentId: Joi.string().uuid().required(),
    },
  }),
  deletePaymentController.handle,
)

paymentRoutes.get(
  '/customer/:customerId',
  ensureAdmin,
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  findPaymentsCustomerController.handle,
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

export default paymentRoutes
