import { container } from 'tsyringe'

import IPaymentRepository from '../payments/repositories/IPaymentRepository'
import PaymentRepository from '../payments/infra/typeorm/repositories/PaymentRepository'

container.registerSingleton<IPaymentRepository>(
  'PaymentRepository',
  PaymentRepository,
)
