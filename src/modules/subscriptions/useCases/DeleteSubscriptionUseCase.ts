import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import ISubscriptionRepository from '../repositories/ISubscriptionRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

@injectable()
class DeleteSubscription {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const checkSubscriptionExists = await this.subscriptionRepository.findById(
      id,
    )

    if (!checkSubscriptionExists)
      throw new AppError('This subscription does not exists')

    await this.subscriptionRepository.remove(checkSubscriptionExists)

    await this.cacheProvider.invalidate(
      `profile:${checkSubscriptionExists.accountId}`,
    )
  }
}

export default DeleteSubscription
