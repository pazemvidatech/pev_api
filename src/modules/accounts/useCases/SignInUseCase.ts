import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'
import { ICreateAccountResponseDTO } from '../dtos/ICreateAccountDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  username: string
  password: string
  fmToken?: string | undefined
}

@injectable()
class SignInUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute({
    username,
    password,
    fmToken,
  }: IRequest): Promise<ICreateAccountResponseDTO> {
    try {
      const response = await this.authProvider.signIn({
        username,
        password,
      })

      if (fmToken) {
        const { id } = await this.authProvider.getUser(username)

        await this.cacheProvider.save(`token:${id}`, fmToken)
      }

      return response
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default SignInUseCase
