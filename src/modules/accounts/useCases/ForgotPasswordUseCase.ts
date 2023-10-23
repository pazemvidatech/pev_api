import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'

interface IRequest {
  username: string
}

@injectable()
class ForgotPasswordUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,
  ) {}

  async execute({ username }: IRequest): Promise<void> {
    try {
      await this.authProvider.forgotPassword(username)
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default ForgotPasswordUseCase
