import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteDependentUseCase from '../../../useCases/DeleteDependentUseCase'

class DeleteDependentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const dependentId = request.params.dependentId
    const deleteDependentUseCase = container.resolve(DeleteDependentUseCase)

    await deleteDependentUseCase.execute(dependentId)

    return response.status(202).send()
  }
}

export default DeleteDependentController
