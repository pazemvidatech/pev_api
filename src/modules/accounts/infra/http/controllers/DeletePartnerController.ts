import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteAccountUseCase from '../../../useCases/DeleteAccountUseCase'

class DeleteAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountId = request.params.accountId
    const deleteAccountUseCase = container.resolve(DeleteAccountUseCase)

    await deleteAccountUseCase.execute(accountId)

    return response.status(204).send()
  }
}

export default DeleteAccountController
