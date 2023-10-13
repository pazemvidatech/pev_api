import { Router } from 'express'

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated'

import ProfileAccountController from '../controllers/ProfileAccountController'

const profileAccountController = new ProfileAccountController()

const accountRoutes = Router()

accountRoutes.use(ensureAuthenticated)

accountRoutes.get('/profile', profileAccountController.handle)

export default accountRoutes
