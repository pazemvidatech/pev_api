import { Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import ISubscriptionRepository from '@modules/subscriptions/repositories/ISubscriptionRepository'

import Subscription from '../entities/Subscription'
import ICreateSubscriptionDTO from '@modules/subscriptions/dtos/ICreateSubscriptionDTO'

class SubscriptionRepository implements ISubscriptionRepository {
  private ormRepository: Repository<Subscription>

  constructor() {
    this.ormRepository = Datasource.getRepository(Subscription)
  }

  public async create(
    SubscriptionData: ICreateSubscriptionDTO,
  ): Promise<Subscription> {
    const Subscription = this.ormRepository.create(SubscriptionData)

    return await this.ormRepository.save(Subscription)
  }

  public async findById(id: string): Promise<Subscription | undefined> {
    const Subscription = await this.ormRepository.findOne({
      where: { id },
    })

    return Subscription
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<Subscription | undefined> {
    const Subscription = await this.ormRepository.findOne({
      where: { externalId },
    })

    return Subscription
  }

  public async findByAccountId(
    accountId: string,
  ): Promise<Subscription | undefined> {
    const Subscription = await this.ormRepository.findOne({
      where: { accountId },
    })

    return Subscription
  }

  public async findAll(): Promise<Subscription[] | undefined> {
    const subscriptions = await this.ormRepository.find()

    return subscriptions
  }

  public async remove(subscription: Subscription): Promise<void> {
    await this.ormRepository.remove(subscription)
  }

  public async save(subscription: Subscription): Promise<void> {
    await this.ormRepository.save(subscription)
  }
}

export default SubscriptionRepository
