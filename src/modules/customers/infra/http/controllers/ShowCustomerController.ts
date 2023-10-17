import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowCustomerUseCase from '../../../useCases/ShowCustomerUseCase'

class ShowCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const customerId = request.params.customerId

    const showCustomerUseCase = container.resolve(ShowCustomerUseCase)

    const customer = await showCustomerUseCase.execute(customerId)

    return response.json(customer)
  }
}

export default ShowCustomerController
