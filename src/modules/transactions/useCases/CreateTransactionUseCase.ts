import Transaction from '../infra/typeorm/entities/Transaction'
import ITransactionRepository from '../repositories/ITransactionRepository'
import { injectable, inject } from 'tsyringe'
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

@injectable()
class CreateTransaction {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    description,
    accountId,
    amount,
    externalId,
    type,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = await this.transactionRepository.create({
      description,
      accountId,
      amount,
      externalId,
      type,
    })

    await this.cacheProvider.invalidate(`profile:${accountId}`)

    return transaction
  }
}

export default CreateTransaction
