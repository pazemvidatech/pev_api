import { ICreateAccountRequestDTO } from '@modules/accounts/dtos/ICreateAccountDTO'
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository'
import { FindManyOptions, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'

import Account from '../entities/Account'
import { IFindAllPartnersResponseDTO } from '@modules/accounts/dtos/IFindAllPartnersDTO'

class AccountRepository implements IAccountRepository {
  private ormRepository: Repository<Account>
  constructor() {
    this.ormRepository = Datasource.getRepository(Account)
  }

  async create(accountData: ICreateAccountRequestDTO): Promise<Account> {
    const account = this.ormRepository.create(accountData)

    return await this.ormRepository.save(account)
  }

  public async findAll(
    query: FindManyOptions<Account>,
  ): Promise<IFindAllPartnersResponseDTO> {
    const result = await this.ormRepository.findAndCount(query)

    return { data: result[0], total: result[1] }
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne({ where: { email } })

    return account
  }

  async findById(id: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOneBy({ id })

    return account
  }

  async remove(account: Account): Promise<Account> {
    return await this.ormRepository.remove(account)
  }

  async save(account: Account): Promise<Account> {
    return await this.ormRepository.save(account)
  }
}

export default AccountRepository
