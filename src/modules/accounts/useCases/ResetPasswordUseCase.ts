import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'

interface IRequest {
  code: string
  username: string
  password: string
}

@injectable()
class ResetPasswordUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,
  ) {}

  async execute({ username, code, password }: IRequest): Promise<void> {
    try {
      await this.authProvider.newPassword({
        username: username,
        code,
        password,
      })
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default ResetPasswordUseCase
