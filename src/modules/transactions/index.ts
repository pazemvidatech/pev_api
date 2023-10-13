import { container } from 'tsyringe'

import ITransactionRepository from '../transactions/repositories/ITransactionRepository'
import TransactionRepository from '../transactions/infra/typeorm/repositories/TransactionRepository'

container.registerSingleton<ITransactionRepository>(
  'TransactionRepository',
  TransactionRepository,
)
