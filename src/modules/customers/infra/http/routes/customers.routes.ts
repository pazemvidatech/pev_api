import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import CreateCustomerController from '../controllers/CreateCustomerController'
import FindAllCustomersController from '../controllers/FindAllCustomersController'
import { Joi, Segments, celebrate } from 'celebrate'
import { arraySorts } from '../../../types/SortQueryType'
import DeleteCustomerController from '../controllers/DeleteCustomerController'
import ShowCustomerController from '../controllers/ShowCustomerController'
import UpdateCustomerController from '../controllers/UpdateCustomerController'
import ShowCustomerByCodeController from '../controllers/ShowCustomerByCodeController'

const createCustomerUseCase = new CreateCustomerController()
const showCustomerController = new ShowCustomerController()
const showCustomerByCodeController = new ShowCustomerByCodeController()
const findAllCustomersController = new FindAllCustomersController()
const updateCustomerController = new UpdateCustomerController()
const deleteCustomerController = new DeleteCustomerController()

const customersRoutes = Router()

customersRoutes.use(ensureAdmin)

customersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
      numberId: Joi.string().trim().required(),
      payday: Joi.number().min(1).max(31).required(),
      frequency: Joi.number().min(3).default(3).optional(),
      oldRegister: Joi.boolean().default(false).optional(),
      silverPlan: Joi.boolean().default(false).optional(),
      email: Joi.string().email().optional(),
      cityId: Joi.string().uuid().required(),
      document: Joi.string().trim().optional(),
      dependents: Joi.array()
        .items(
          Joi.object()
            .keys({
              name: Joi.string().trim().required(),
              deathDate: Joi.date().optional(),
            })
            .unknown(false),
        )
        .optional(),
    },
  }),
  createCustomerUseCase.handle,
)

customersRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().optional(),
      cityId: Joi.string().uuid().optional(),
      sort: Joi.string()
        .valid(...arraySorts)
        .optional()
        .default('createdAt:DESC'),
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(30),
    }).unknown(false),
  }),
  findAllCustomersController.handle,
)

customersRoutes.get(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  showCustomerController.handle,
)

customersRoutes.post(
  '/code',
  celebrate({
    [Segments.BODY]: {
      code: Joi.string().required(),
    },
  }),
  showCustomerByCodeController.handle,
)

customersRoutes.put(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
      numberId: Joi.string().trim().required(),
      payday: Joi.number().min(1).max(31).required(),
      silverPlan: Joi.boolean().default(false).optional(),
      cityId: Joi.string().uuid().required(),
      email: Joi.string().email().optional(),
      document: Joi.string().trim().optional(),
      dependents: Joi.array()
        .items(
          Joi.object()
            .keys({
              id: Joi.string().uuid().optional(),
              name: Joi.string().trim().required(),
              deathDate: Joi.date().optional(),
            })
            .unknown(false),
        )
        .optional(),
    }).unknown(false),
  }),
  updateCustomerController.handle,
)

customersRoutes.delete(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  deleteCustomerController.handle,
)

export default customersRoutes
