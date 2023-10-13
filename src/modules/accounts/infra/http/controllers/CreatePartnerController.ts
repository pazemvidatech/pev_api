import { Response, Request } from 'express'
import { container } from 'tsyringe'

import CreatePartnerUseCase from '../../../useCases/CreatePartnerUseCase'

export default class CreatePartnerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { username, email, name, role } = req.body

    const createPartnerUseCase = container.resolve(CreatePartnerUseCase)

    await createPartnerUseCase.execute({
      username,
      email,
      name,
      role: Number(role),
    })

    return res.status(204).send()
  }
}
