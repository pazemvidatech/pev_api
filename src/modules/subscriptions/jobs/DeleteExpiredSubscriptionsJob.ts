import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'
import ISubscriptionRepository from '../repositories/ISubscriptionRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

@injectable()
class DeleteExpiredSubscriptionsJob {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<void> {
    await this.subscriptionRepository.removeExpireds(100)

    await this.cacheProvider.invalidatePrefix('profile')
  }
}

export default DeleteExpiredSubscriptionsJob
