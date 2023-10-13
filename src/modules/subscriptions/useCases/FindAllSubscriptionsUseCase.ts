import ISubscriptionRepository from '../repositories/ISubscriptionRepository'
import Subscription from '../infra/typeorm/entities/Subscription'
import { injectable, inject } from 'tsyringe'

@injectable()
class FindAllSubscriptions {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  public async execute(): Promise<Subscription[] | undefined> {
    const subscriptions = await this.subscriptionRepository.findAll()

    return subscriptions
  }
}

export default FindAllSubscriptions
