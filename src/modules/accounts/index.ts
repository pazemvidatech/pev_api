import { container } from 'tsyringe'

import IAccountRepository from '../accounts/repositories/IAccountRepository'
import AccountRepository from '../accounts/infra/typeorm/repositories/AccountRepository'

container.registerSingleton<IAccountRepository>(
  'AccountRepository',
  AccountRepository,
)
