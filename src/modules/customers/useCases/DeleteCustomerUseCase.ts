import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import ICustomerRepository from '../repositories/ICustomerRepository'

@injectable()
class DeleteCustomerUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(customerId: string): Promise<void> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) throw new AppError('Partner not found', 404)

    await this.customerRepository.remove(customer)
  }
}

export default DeleteCustomerUseCase
