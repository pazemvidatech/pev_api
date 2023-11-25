import { Router } from 'express'

import ensureAdmin from '@shared/infra/http/middlewares/ensureAdmin'
import FindAllCitiesController from '../controllers/FindAllCitiesController'
import UpdateCityController from '../controllers/UpdateCityController'
import DeleteCityController from '../controllers/DeleteCityController'
import CreateCityController from '../controllers/CreateCityController'
import { Joi, Segments, celebrate } from 'celebrate'

const createCityController = new CreateCityController()
const findAllCitiesController = new FindAllCitiesController()
const deleteCityController = new DeleteCityController()
const updateCityController = new UpdateCityController()

const cityRoutes = Router()

cityRoutes.use(ensureAdmin)

cityRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
    },
  }),
  createCityController.handle,
)

cityRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().optional().default(1),
      size: Joi.number().optional().default(30),
    }).unknown(false),
  }),
  findAllCitiesController.handle,
)

cityRoutes.put(
  '/:cityId',
  celebrate({
    [Segments.PARAMS]: {
      cityId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().trim().required(),
    },
  }),
  updateCityController.handle,
)

cityRoutes.delete(
  '/:cityId',
  celebrate({
    [Segments.PARAMS]: {
      cityId: Joi.string().uuid().required(),
    },
  }),
  deleteCityController.handle,
)

export default cityRoutes
