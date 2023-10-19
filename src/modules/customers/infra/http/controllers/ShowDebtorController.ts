import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowDebtorUseCase from '../../../useCases/ShowDebtorUseCase'

class ShowDebtorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { debtorId } = request.params

    const showDebtorUseCase = container.resolve(ShowDebtorUseCase)

    const customer = await showDebtorUseCase.execute(debtorId)

    return response.json(customer)
  }
}

export default ShowDebtorController
