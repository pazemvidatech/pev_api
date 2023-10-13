import { Response, Request } from 'express'
import { container } from 'tsyringe'

import SignInUseCase from '../../../useCases/SignInUseCase'

export default class SignInController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { username, password, fmToken } = req.body

    const signInUseCase = container.resolve(SignInUseCase)

    const data = await signInUseCase.execute({
      username,
      password,
      fmToken,
    })

    return res.json(data)
  }
}
