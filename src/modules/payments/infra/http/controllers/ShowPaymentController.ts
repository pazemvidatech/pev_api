import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ShowPaymentUseCase from '../../../useCases/ShowPaymentUseCase'

class ShowPaymentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const paymentId = request.params.paymentId

    const showPaymentUseCase = container.resolve(ShowPaymentUseCase)

    const payment = await showPaymentUseCase.execute(paymentId)

    return response.json(payment)
  }
}

export default ShowPaymentController
