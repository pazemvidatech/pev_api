import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO'
import {
  IFindAllTransactionsDTO,
  IFindAllTransactionsResponseDTO,
} from '../dtos/IFindAllTransactionsDTO'
import Transaction from '../infra/typeorm/entities/Transaction'

export default interface ITransactionRepository {
  create(dataTransaction: ICreateTransactionDTO): Promise<Transaction>
  findByExternalId(externalId: string): Promise<Transaction | undefined>
  findById(id: string): Promise<Transaction | undefined>
  findByAccountId(accountId: string): Promise<Transaction | undefined>
  findAll(
    data: IFindAllTransactionsDTO,
  ): Promise<IFindAllTransactionsResponseDTO>
  remove(subscription: Transaction): Promise<void>
  save(subscription: Transaction): Promise<void>
}
