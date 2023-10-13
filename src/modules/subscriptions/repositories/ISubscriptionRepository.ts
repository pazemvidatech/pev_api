import ICreateSubscriptionDTO from '../dtos/ICreateSubscriptionDTO'
import Subscription from '../infra/typeorm/entities/Subscription'

export default interface ISubscriptionRepository {
  create(dataSubscription: ICreateSubscriptionDTO): Promise<Subscription>
  findByExternalId(externalId: string): Promise<Subscription | undefined>
  findById(id: string): Promise<Subscription | undefined>
  findByAccountId(accountId: string): Promise<Subscription | undefined>
  findAll(): Promise<Subscription[] | undefined>
  remove(subscription: Subscription): Promise<void>
  save(subscription: Subscription): Promise<void>
}
