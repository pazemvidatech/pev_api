import IRenegotiationRepository from '../repositories/IRenegotiationRepository'
import { injectable, inject } from 'tsyringe'
import Renegotiation from '../infra/typeorm/entities/Renegotiation'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'

@injectable()
class FindRenegotiationsCustomerUseCase {
  constructor(
    @inject('RenegotiationRepository')
    private renegotiationRepository: IRenegotiationRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(customerId: string): Promise<Renegotiation[]> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) throw new AppError('Customer not found', 404)

    const renegotiations = await this.renegotiationRepository.findAllByCustomerId(
      customerId,
    )

    return renegotiations
  }
}

export default FindRenegotiationsCustomerUseCase
