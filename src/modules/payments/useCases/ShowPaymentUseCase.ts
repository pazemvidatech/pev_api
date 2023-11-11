import { inject, injectable } from 'tsyringe'

import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'
import AppError from '@shared/errors/AppError'
import Payment from '../infra/typeorm/entities/Payment'
import { PaymentList } from '../dtos/IFindAllPaymentsDTO'

@injectable()
class ShowPaymentUseCase {
  constructor(
    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  async execute(paymentId: string): Promise<PaymentList> {
    const payment = await this.paymentRepository.findById(paymentId)

    if (!payment) throw new AppError('Payment not found', 404)

    return payment
  }
}

export default ShowPaymentUseCase
