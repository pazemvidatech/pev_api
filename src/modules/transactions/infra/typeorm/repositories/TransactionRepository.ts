import { DataSource, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import ITransactionRepository from '@modules/transactions/repositories/ITransactionRepository'

import Transaction from '../entities/Transaction'
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO'
import Account from '@modules/accounts/infra/typeorm/entities/Account'
import {
  IFindAllTransactionsDTO,
  IFindAllTransactionsResponseDTO,
} from '@modules/transactions/dtos/IFindAllTransactionsDTO'
import { classToPlain } from 'class-transformer'

class TransactionRepository implements ITransactionRepository {
  private ormRepository: Repository<Transaction>
  private connection: DataSource

  constructor() {
    this.connection = Datasource
    this.ormRepository = Datasource.getRepository(Transaction)
  }

  public async create(
    transactionData: ICreateTransactionDTO,
  ): Promise<Transaction> {
    return await this.connection.transaction(async entityManager => {
      const tran = new Transaction()
      tran.description = transactionData.description
      tran.externalId = transactionData.externalId
      tran.accountId = transactionData.accountId
      tran.amount = transactionData.amount
      tran.type = transactionData.type

      await entityManager.save(tran)

      const account = await entityManager.findOneBy(Account, {
        id: transactionData.accountId,
      })

      const isCredit = tran.type === 'credit'
      account.credits = isCredit
        ? account.credits + tran.amount
        : account.credits - tran.amount
      await entityManager.save(account)

      return tran
    })
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const Transaction = await this.ormRepository.findOne({
      where: { id },
    })

    return Transaction
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<Transaction | undefined> {
    const Transaction = await this.ormRepository.findOne({
      where: { externalId },
    })

    return Transaction
  }

  public async findByAccountId(
    accountId: string,
  ): Promise<Transaction | undefined> {
    const Transaction = await this.ormRepository.findOne({
      where: { accountId },
    })

    return Transaction
  }

  public async findAll(
    query: IFindAllTransactionsDTO,
  ): Promise<IFindAllTransactionsResponseDTO> {
    const transactions = await this.ormRepository.findAndCount(query)

    return {
      data: classToPlain(transactions[0]) as Transaction[],
      total: transactions[1],
    }
  }

  public async remove(transaction: Transaction): Promise<void> {
    await this.connection.transaction(async entityManager => {
      await entityManager.remove(transaction)

      const account = await entityManager.findOneBy(Account, {
        id: transaction.accountId,
      })

      const isCredit = transaction.type === 'credit'
      account.credits = isCredit
        ? account.credits - transaction.amount
        : account.credits + transaction.amount
      await entityManager.save(account)
    })
  }

  public async save(transaction: Transaction): Promise<void> {
    await this.ormRepository.save(transaction)
  }
}

export default TransactionRepository
