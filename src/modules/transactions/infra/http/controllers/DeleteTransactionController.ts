import { Request, Response } from 'express'
import { container } from 'tsyringe'

import DeleteTransactionUseCase from '../../../useCases/DeleteTransactionUseCase'

class DeleteTransactionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { transactionId } = req.params

    const deleteTransaction = container.resolve(DeleteTransactionUseCase)

    await deleteTransaction.execute(transactionId)

    return res.status(204).send()
  }
}

export default DeleteTransactionController
