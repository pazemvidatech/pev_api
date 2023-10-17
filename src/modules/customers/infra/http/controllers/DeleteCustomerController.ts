import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteCustomerUseCase from '../../../useCases/DeleteCustomerUseCase'

class DeleteCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const customerId = request.params.customerId
    const deleteCustomerUseCase = container.resolve(DeleteCustomerUseCase)

    await deleteCustomerUseCase.execute(customerId)

    return response.status(202).send()
  }
}

export default DeleteCustomerController
