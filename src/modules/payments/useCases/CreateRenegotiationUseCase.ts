import Renegotiation from '../infra/typeorm/entities/Renegotiation'
import IRenegotiationRepository from '../repositories/IRenegotiationRepository'
import { injectable, inject } from 'tsyringe'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'
import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'

interface IRequest {
  customerId: string
  accountId: string
  negotiator: string
}

@injectable()
class CreateRenegotiationUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('RenegotiationRepository')
    private renegotiationRepository: IRenegotiationRepository,

    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute({
    customerId,
    accountId,
    negotiator,
  }: IRequest): Promise<Renegotiation> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      throw new AppError('Customer not found', 404)
    }

    const paymentCount = await this.customerRepository.findPaymentCountByCustomerId(
      customerId,
    )

    if (customer.frequency >= paymentCount) {
      throw new AppError('The customer is not a debtor', 404)
    }

    const amountRenegotiation = await this.featureFlagProvider.getConfig(
      'amountRenegotiation',
    )

    const renegotiation = await this.renegotiationRepository.create({
      customerId,
      accountId,
      amount: Number(amountRenegotiation),
      negotiator,
    })

    return renegotiation
  }
}

export default CreateRenegotiationUseCase
