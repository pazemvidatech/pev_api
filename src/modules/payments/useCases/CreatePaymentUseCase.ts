import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'
import Payment from '../infra/typeorm/entities/Payment'
import IPaymentRepository from '../repositories/IPaymentRepository'
import { injectable, inject } from 'tsyringe'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'

interface IRequest {
  customerId: string
  accountId: string
  quantity: number
}

@injectable()
class CreatePaymentUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,

    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute({
    customerId,
    accountId,
    quantity,
  }: IRequest): Promise<Payment[]> {
    const customer = await this.customerRepository.findById(customerId)

    let keyAmount: string

    if (customer.silverPlan) {
      keyAmount = 'silverAmount'
    } else {
      keyAmount = 'normalAmount'
    }

    console.log(keyAmount)

    const amount = (await this.featureFlagProvider.getConfig(
      keyAmount,
    )) as number

    console.log(amount)

    const payments = await this.paymentRepository.create({
      customerId,
      accountId,
      amount,
      quantity,
    })

    return payments
  }
}

export default CreatePaymentUseCase