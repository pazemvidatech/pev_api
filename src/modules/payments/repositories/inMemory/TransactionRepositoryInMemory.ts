import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'

import Payment from '../../infra/typeorm/entities/Payment'
import ICreatePaymentDTO from '@modules/payments/dtos/ICreatePaymentDTO'
import { v4 as uuid_v4 } from 'uuid'
import {
  IFindAllPaymentsDTO,
  IFindAllPaymentsResponseDTO,
} from '@modules/payments/dtos/IFindAllPaymentsDTO'

class PaymentRepositoryInMemory implements IPaymentRepository {
  private payments: Payment[] = []

  public async create(subscriptionData: ICreatePaymentDTO): Promise<Payment> {
    const { description, accountId, amount, type } = subscriptionData
    const subscription = new Payment()

    Object.assign(subscription, {
      id: uuid_v4(),
      description,
      accountId,
      amount,
      type,
    })

    this.payments.push(subscription)

    return subscription
  }

  public async findById(id: string): Promise<Payment | undefined> {
    const subscription = this.payments.find(
      subscription => subscription.id === id,
    )

    return subscription
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<Payment | undefined> {
    const subscription = this.payments.find(
      subscription => subscription.externalId === externalId,
    )

    return subscription
  }

  public async findByAccountId(
    externalId: string,
  ): Promise<Payment | undefined> {
    const subscription = this.payments.find(
      subscription => subscription.accountId === externalId,
    )

    return subscription
  }

  public async findAll(
    data: IFindAllPaymentsDTO,
  ): Promise<IFindAllPaymentsResponseDTO> {
    const payments = this.payments.filter(
      e => e.accountId === data.where.accountId,
    )

    return { data: payments, total: payments.length }
  }

  public async remove(subscription: Payment): Promise<void> {
    const findIndex = this.payments.findIndex(
      findsubscription => findsubscription === subscription,
    )

    this.payments.splice(findIndex, 1)
  }

  public async save(subscription: Payment): Promise<void> {
    const findIndex = this.payments.findIndex(
      findsubscription => findsubscription.id === subscription.id,
    )

    this.payments[findIndex] = subscription
  }
}

export default PaymentRepositoryInMemory
