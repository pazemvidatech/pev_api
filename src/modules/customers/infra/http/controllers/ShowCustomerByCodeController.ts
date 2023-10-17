import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowCustomerByCodeUseCase from '../../../useCases/ShowCustomerByCodeUseCase'

class ShowCustomerByCodeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code } = request.body

    const showCustomerByCodeUseCase = container.resolve(
      ShowCustomerByCodeUseCase,
    )

    const customer = await showCustomerByCodeUseCase.execute(code)

    return response.json(customer)
  }
}

export default ShowCustomerByCodeController
