import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateTransactionUseCase from '../../../useCases/CreateTransactionUseCase'
import { plainToClass } from 'class-transformer'
import Transaction from '../../typeorm/entities/Transaction'

class CreateTransactionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { description, amount, accountId, type, externalId } = req.body

    const createTransaction = container.resolve(CreateTransactionUseCase)

    const transaction = await createTransaction.execute({
      description,
      accountId,
      externalId,
      amount,
      type,
    })

    return res.json(plainToClass(Transaction, transaction))
  }
}

export default CreateTransactionController
