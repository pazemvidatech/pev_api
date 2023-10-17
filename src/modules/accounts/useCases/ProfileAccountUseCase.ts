import { inject, injectable } from 'tsyringe'

import IAccountRepository from '@modules/accounts/repositories/IAccountRepository'
import { IProfileAccountResponseDTO } from '@modules/accounts/dtos/IProfileAccountDTO'
import { AccountMap } from '@modules/accounts/mapper/AccountMap'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import Account from '../infra/typeorm/entities/Account'
import { Request } from 'express'

@injectable()
class ProfileAccountUseCase {
  constructor(
    @inject('AccountRepository')
    private accountRepository: IAccountRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(data: Request['account']): Promise<IProfileAccountResponseDTO> {
    const { id, email, name, role, username } = data

    const profileCached = await this.cacheProvider.recover<
      IProfileAccountResponseDTO
    >(`profile:${id}`)

    if (profileCached != null) {
      return profileCached
    } else {
      let account: Account
      account = await this.accountRepository.findById(id)

      if (!account) {
        account = await this.accountRepository.create({
          name,
          email,
          role,
          username,
          id,
        })

        account = await this.accountRepository.findById(id)
      }

      const profile = AccountMap.toDTO(account)

      await this.cacheProvider.save(`profile:${id}`, profile)

      return profile
    }
  }
}

export default ProfileAccountUseCase
