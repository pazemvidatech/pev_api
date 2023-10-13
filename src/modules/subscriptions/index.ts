import { container } from 'tsyringe'

import ISubscriptionRepository from '../subscriptions/repositories/ISubscriptionRepository'
import SubscriptionRepository from '../subscriptions/infra/typeorm/repositories/SubscriptionRepository'

container.registerSingleton<ISubscriptionRepository>(
  'SubscriptionRepository',
  SubscriptionRepository,
)
