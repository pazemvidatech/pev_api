import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import ITransactionRepository from '../repositories/ITransactionRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

@injectable()
class DeleteTransaction {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id)

    if (!transaction) throw new AppError('This transaction does not exists')

    await this.transactionRepository.remove(transaction)

    await this.cacheProvider.invalidate(`profile:${transaction.accountId}`)
  }
}

export default DeleteTransaction
