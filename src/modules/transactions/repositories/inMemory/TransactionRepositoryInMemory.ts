import ITransactionRepository from '@modules/transactions/repositories/ITransactionRepository'

import Transaction from '../../infra/typeorm/entities/Transaction'
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO'
import { v4 as uuid_v4 } from 'uuid'
import {
  IFindAllTransactionsDTO,
  IFindAllTransactionsResponseDTO,
} from '@modules/transactions/dtos/IFindAllTransactionsDTO'

class TransactionRepositoryInMemory implements ITransactionRepository {
  private transactions: Transaction[] = []

  public async create(
    subscriptionData: ICreateTransactionDTO,
  ): Promise<Transaction> {
    const { description, accountId, amount, type } = subscriptionData
    const subscription = new Transaction()

    Object.assign(subscription, {
      id: uuid_v4(),
      description,
      accountId,
      amount,
      type,
    })

    this.transactions.push(subscription)

    return subscription
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const subscription = this.transactions.find(
      subscription => subscription.id === id,
    )

    return subscription
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<Transaction | undefined> {
    const subscription = this.transactions.find(
      subscription => subscription.externalId === externalId,
    )

    return subscription
  }

  public async findByAccountId(
    externalId: string,
  ): Promise<Transaction | undefined> {
    const subscription = this.transactions.find(
      subscription => subscription.accountId === externalId,
    )

    return subscription
  }

  public async findAll(
    data: IFindAllTransactionsDTO,
  ): Promise<IFindAllTransactionsResponseDTO> {
    const transactions = this.transactions.filter(
      e => e.accountId === data.where.accountId,
    )

    return { data: transactions, total: transactions.length }
  }

  public async remove(subscription: Transaction): Promise<void> {
    const findIndex = this.transactions.findIndex(
      findsubscription => findsubscription === subscription,
    )

    this.transactions.splice(findIndex, 1)
  }

  public async save(subscription: Transaction): Promise<void> {
    const findIndex = this.transactions.findIndex(
      findsubscription => findsubscription.id === subscription.id,
    )

    this.transactions[findIndex] = subscription
  }
}

export default TransactionRepositoryInMemory
