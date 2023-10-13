import { Request, Response } from 'express'
import { container } from 'tsyringe'

import RefreshTokenUseCase from '../../../useCases/RefreshTokenUseCase'

class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { refreshToken, fmToken } = req.body
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

    const data = await refreshTokenUseCase.execute({
      refreshToken,
      fmToken,
    })

    return res.json(data)
  }
}

export default RefreshTokenController
