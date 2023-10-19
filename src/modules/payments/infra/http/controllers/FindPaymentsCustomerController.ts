import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindPaymentsCustomerUseCase from '../../../useCases/FindPaymentsCustomerUseCase'
import { SortQueryType } from '@modules/payments/types/SortQueryType'

class FindPaymentsCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { customerId } = req.params

    const findPaymentsCustomer = container.resolve(FindPaymentsCustomerUseCase)

    const payments = await findPaymentsCustomer.execute(customerId)

    return res.json(payments)
  }
}

export default FindPaymentsCustomerController
