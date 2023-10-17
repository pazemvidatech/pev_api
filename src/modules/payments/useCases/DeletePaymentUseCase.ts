import IPaymentRepository from '../repositories/IPaymentRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import { Request } from 'express'

@injectable()
class DeletePaymentUseCase {
  constructor(
    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  public async execute(id: string, account: Request['account']): Promise<void> {
    const payment = await this.paymentRepository.findById(id)

    if (account.id != payment.accountId && account.role != 1) {
      throw new AppError('Not permission', 403)
    }

    if (!payment) throw new AppError('This payment does not exists')

    await this.paymentRepository.remove(payment)
  }
}

export default DeletePaymentUseCase
