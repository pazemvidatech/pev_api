import { Router } from 'express'

import swaggerUI, { SwaggerUiOptions } from 'swagger-ui-express'
import swaggerFile from '../../../../swagger.json'

import AccountRouter from '@modules/accounts/infra/http/routes/account.routes'
import CustomerRouter from '@modules/customers/infra/http/routes/customers.routes'
import DebtorRouter from '@modules/customers/infra/http/routes/debtors.routes'
import DependentRouter from '@modules/customers/infra/http/routes/dependents.routes'
import PasswordRouter from '@modules/accounts/infra/http/routes/password.routes'
import AuthenticateRouter from '@modules/accounts/infra/http/routes/authenticate.routes'
import PartnersRouter from '@modules/accounts/infra/http/routes/partners.routes'
import PaymentRouter from '@modules/payments/infra/http/routes/payment.routes'
import RenegotiationRouter from '@modules/payments/infra/http/routes/renegotiation.routes'
import PreferencesRouter from '@modules/preferences/infra/http/routes/preferences.routes'
import CityRouter from '@modules/cities/infra/http/routes/cities.routes'

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
routes.use('/debtors', DebtorRouter)
routes.use('/dependents', DependentRouter)
routes.use('/passwords', PasswordRouter)
routes.use('/partners', PartnersRouter)
routes.use('/payments', PaymentRouter)
routes.use('/renegotiations', RenegotiationRouter)
routes.use('/preferences', PreferencesRouter)
routes.use('/cities', CityRouter)
routes.use('/auth', AuthenticateRouter)

export default routes
