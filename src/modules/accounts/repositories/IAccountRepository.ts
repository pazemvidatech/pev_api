import { ICreateAccountRequestDTO } from '../dtos/ICreateAccountDTO'
import {
  IFindAllPartnersDTO,
  IFindAllPartnersResponseDTO,
} from '../dtos/IFindAllPartnersDTO'
import Account from '../infra/typeorm/entities/Account'

export default interface IAccountRepository {
  create(accountData: ICreateAccountRequestDTO): Promise<Account>
  findAll(data: IFindAllPartnersDTO): Promise<IFindAllPartnersResponseDTO>
  findByEmail(email: string): Promise<Account | undefined>
  findById(account_id: string): Promise<Account | undefined>
  remove(account: Account): Promise<Account>
  save(account: Account): Promise<Account>
}
