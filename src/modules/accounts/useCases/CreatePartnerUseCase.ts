import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'
import IAccountRepository from '../repositories/IAccountRepository'

interface IRequest {
  username: string
  email: string
  name: string
  role: number
}

@injectable()
class CreatePartnerUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,

    @inject('AccountRepository')
    private accountRepository: IAccountRepository,
  ) {}

  async execute({ username, email, name, role }: IRequest): Promise<void> {
    try {
      const id = await this.authProvider.createUser({
        username,
        userAttr: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'custom:role', Value: role.toString() },
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
      })

      await this.accountRepository.create({ id, username, email, name, role })
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default CreatePartnerUseCase
