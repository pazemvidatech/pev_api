import { Router } from 'express'

import swaggerUI, { SwaggerUiOptions } from 'swagger-ui-express'
import swaggerFile from '../../../../swagger.json'

import AccountRouter from '@modules/accounts/infra/http/routes/account.routes'
import CustomerRouter from '@modules/customers/infra/http/routes/customers.routes'
import DependentRouter from '@modules/customers/infra/http/routes/dependents.routes'
import PasswordRouter from '@modules/accounts/infra/http/routes/password.routes'
import AuthenticateRouter from '@modules/accounts/infra/http/routes/authenticate.routes'
import PartnersRouter from '@modules/accounts/infra/http/routes/partners.routes'
import PaymentRouter from '@modules/payments/infra/http/routes/payment.routes'
const optionsSwagger = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pev - API Documentation',
} as SwaggerUiOptions

const routes = Router()

routes.use(
  '/documentation',
  swaggerUI.serve,
  swaggerUI.setup(swaggerFile, optionsSwagger),
)

routes.use('/accounts', AccountRouter)
routes.use('/customers', CustomerRouter)
routes.use('/dependents', DependentRouter)
routes.use('/passwords', PasswordRouter)
routes.use('/partners', PartnersRouter)
routes.use('/payments', PaymentRouter)
routes.use('/auth', AuthenticateRouter)

export default routes
