import ISubscriptionRepository from '@modules/subscriptions/repositories/ISubscriptionRepository'

import Subscription from '../../infra/typeorm/entities/Subscription'
import ICreateSubscriptionDTO from '@modules/subscriptions/dtos/ICreateSubscriptionDTO'
import { v4 as uuid_v4 } from 'uuid'

class SubscriptionRepositoryInMemory implements ISubscriptionRepository {
  private subscriptions: Subscription[] = []

  public async create(
    subscriptionData: ICreateSubscriptionDTO,
  ): Promise<Subscription> {
    const { name, accountId, platform, externalId } = subscriptionData
    const subscription = new Subscription()

    Object.assign(subscription, {
      id: uuid_v4(),
      name,
      accountId,
      platform,
      externalId,
    })

    this.subscriptions.push(subscription)

    return subscription
  }

  public async findById(id: string): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.find(
      subscription => subscription.id === id,
    )

    return subscription
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.find(
      subscription => subscription.externalId === externalId,
    )

    return subscription
  }

  public async findByAccountId(
    externalId: string,
  ): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.find(
      subscription => subscription.accountId === externalId,
    )

    return subscription
  }

  public async findAll(): Promise<Subscription[] | undefined> {
    const subscriptions = this.subscriptions

    return subscriptions
  }

  public async remove(subscription: Subscription): Promise<void> {
    const findIndex = this.subscriptions.findIndex(
      findsubscription => findsubscription === subscription,
    )

    this.subscriptions.splice(findIndex, 1)
  }

  public async save(subscription: Subscription): Promise<void> {
    const findIndex = this.subscriptions.findIndex(
      findsubscription => findsubscription.id === subscription.id,
    )

    this.subscriptions[findIndex] = subscription
  }
}

export default SubscriptionRepositoryInMemory
