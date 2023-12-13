import { container } from 'tsyringe'
import IPaymentRepository from './repositories/IPaymentRepository'
import PaymentRepository from './infra/typeorm/repositories/PaymentRepository'
import IRenegotiationRepository from '../payments/repositories/IRenegotiationRepository'
import RenegotiationRepository from '../payments/infra/typeorm/repositories/RenegotiationRepository'

container.registerSingleton<IPaymentRepository>(
  'PaymentRepository',
  PaymentRepository,
)

container.registerSingleton<IRenegotiationRepository>(
  'RenegotiationRepository',
  RenegotiationRepository,
)
