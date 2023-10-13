import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'

interface IRequest {
  email: string
}

@injectable()
class ForgotPasswordUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    try {
      await this.authProvider.forgotPassword(email)
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default ForgotPasswordUseCase
