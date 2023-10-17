import { container } from 'tsyringe'

import IDependentRepository from '../customers/repositories/IDependentRepository'
import DependentRepository from '../customers/infra/typeorm/repositories/DependentRepository'
import ICustomerRepository from '../customers/repositories/ICustomerRepository'
import CustomerRepository from '../customers/infra/typeorm/repositories/CustomerRepository'

container.registerSingleton<ICustomerRepository>(
  'CustomerRepository',
  CustomerRepository,
)

container.registerSingleton<IDependentRepository>(
  'DependentRepository',
  DependentRepository,
)
