import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import CreateTransactionController from '../controllers/CreateTransactionController'
import DeleteTransactionController from '../controllers/DeleteTransactionController'
import FindAllTransactionsController from '../controllers/FindAllTransactionsController'
import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated'
import { arraySorts } from '@modules/transactions/types/SortQueryType'

const transactionRoutes = Router()
const createTransactionController = new CreateTransactionController()
const deleteTransactionController = new DeleteTransactionController()
const findAllTransactionsController = new FindAllTransactionsController()

transactionRoutes.use(ensureAuthenticated)

transactionRoutes.get(
  '/',
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
  findAllTransactionsController.handle,
)

transactionRoutes.use(ensureAdmin)

transactionRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      accountId: Joi.string().uuid().required(),
      description: Joi.string().required(),
      externalId: Joi.string().optional(),
      amount: Joi.number().required(),
      type: Joi.string()
        .valid(...['credit', 'debit'])
        .required(),
    },
  }),
  createTransactionController.handle,
)

transactionRoutes.delete(
  '/:transactionId',
  celebrate({
    [Segments.PARAMS]: {
      transactionId: Joi.string().uuid().required(),
    },
  }),
  deleteTransactionController.handle,
)

export default transactionRoutes
