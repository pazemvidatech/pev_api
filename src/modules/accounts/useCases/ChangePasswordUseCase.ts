import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'

interface IRequest {
  accessToken: string
  oldPassword: string
  newPassword: string
}

@injectable()
class ChangePasswordUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,
  ) {}

  async execute({
    accessToken,
    oldPassword,
    newPassword,
  }: IRequest): Promise<void> {
    try {
      await this.authProvider.changePassword({
        accessToken,
        oldPassword,
        newPassword,
      })
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default ChangePasswordUseCase
