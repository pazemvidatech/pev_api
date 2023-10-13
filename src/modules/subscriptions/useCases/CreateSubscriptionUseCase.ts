import Subscription from '../infra/typeorm/entities/Subscription'
import ISubscriptionRepository from '../repositories/ISubscriptionRepository'
import { injectable, inject } from 'tsyringe'
import ICreateSubscriptionDTO from '../dtos/ICreateSubscriptionDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

@injectable()
class CreateSubscription {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    accountId,
    platform,
    externalId,
  }: ICreateSubscriptionDTO): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.create({
      name,
      accountId,
      platform,
      externalId,
    })

    await this.cacheProvider.invalidate(`profile:${accountId}`)

    return subscription
  }
}

export default CreateSubscription
