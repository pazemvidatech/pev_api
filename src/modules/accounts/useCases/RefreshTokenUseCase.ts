import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAuthenticationProvider from '@shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider'
import { ICreateAccountResponseDTO } from '../dtos/ICreateAccountDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
interface IRequest {
  refreshToken: string
  fmToken?: string | undefined
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('AuthenticationProvider')
    private authProvider: IAuthenticationProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute({
    refreshToken,
    fmToken,
  }: IRequest): Promise<ICreateAccountResponseDTO> {
    try {
      const authReponse = await this.authProvider.refreshToken(refreshToken)

      if (fmToken) {
        const { email } = await this.authProvider.verifyToken(
          authReponse.accessToken,
        )
        const { id } = await this.authProvider.getUser(email)

        await this.cacheProvider.save(`token:${id}`, fmToken)
      }

      return authReponse
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default RefreshTokenUseCase
