import IRenegotiationRepository from '../repositories/IRenegotiationRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import IPaymentRepository from '../repositories/IPaymentRepository'

@injectable()
class DeleteRenegotiationUseCase {
  constructor(
    @inject('RenegotiationRepository')
    private renegotiationRepository: IRenegotiationRepository,

    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const renegotiation = await this.renegotiationRepository.findById(id)

    if (!renegotiation) {
      throw new AppError('This renegotiation does not exists', 404)
    }

    const lastPayment = await this.paymentRepository.findLastPaymentByCustomer(
      renegotiation.customerId,
    )

    if (lastPayment.renegotiationId !== renegotiation.id) {
      throw new AppError('The deletion of this renegotiation has expired', 400)
    }

    await this.renegotiationRepository.remove(renegotiation)
  }
}

export default DeleteRenegotiationUseCase
