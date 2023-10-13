import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'
import IAccountRepository from '../repositories/IAccountRepository'

@injectable()
class DeleteAccountUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,

    @inject('AccountRepository')
    private accountRepository: IAccountRepository,
  ) {}

  async execute(accountId: string): Promise<void> {
    try {
      const account = await this.accountRepository.findById(accountId)

      if (!account) throw new AppError('Partner not found', 404)

      await this.authProvider.closeAccount(account.email)

      await this.accountRepository.remove(account)
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default DeleteAccountUseCase
