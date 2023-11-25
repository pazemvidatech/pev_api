import { inject, injectable } from 'tsyringe'

import ICustomerRepository from '../repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'
import Dependent from '../infra/typeorm/entities/Dependent'
import ICityRepository from '@modules/cities/repositories/ICityRepository'

interface IRequest {
  customerId: string
  name: string
  email?: string | undefined
  document?: string | undefined
  silverPlan: boolean
  address: string
  cityId: string
  payday: number
  numberId: string
  dependents: Dependent[]
}

@injectable()
class UpdateCustomerUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('CityRepository')
    private cityRepository: ICityRepository,
  ) {}

  async execute({
    customerId,
    name,
    silverPlan,
    numberId,
    address,
    email,
    cityId,
    document,
    payday,
    dependents,
  }: IRequest): Promise<void> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) throw new AppError('Customer not found', 404)

    const city = await this.cityRepository.findById(cityId)

    if (!city) throw new AppError('City not found', 404)

    if (name) customer.name = name
    if (silverPlan) customer.silverPlan = silverPlan
    if (numberId) customer.numberId = numberId
    if (address) customer.address = address
    if (email) customer.email = email
    if (cityId) customer.cityId = cityId
    if (document) customer.document = document
    if (payday) customer.payday = payday
    if (dependents) customer.dependents = dependents

    await this.customerRepository.save(customer)
  }
}

export default UpdateCustomerUseCase
