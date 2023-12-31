import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import ICustomerRepository from '../repositories/ICustomerRepository'
import {
  ICreateDependentRequestDTO,
  ICreatePaymentRequestDTO,
} from '../dtos/ICreateCustomerDTO'
import ICityRepository from '@modules/cities/repositories/ICityRepository'
import { makeCode } from '@config/utils/make_code'

interface IRequest {
  name: string
  email?: string | undefined
  phone?: string | undefined
  document?: string | undefined
  silverPlan: boolean
  oldRegister: boolean
  frequency: number
  address: string
  cityId: string
  payday: number
  numberId: string
  dependents: ICreateDependentRequestDTO[]
  payments?: ICreatePaymentRequestDTO[]
}

@injectable()
class CreateCustomerUseCase {
  constructor(
    @inject('CityRepository')
    private cityRepository: ICityRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  async execute({
    name,
    silverPlan,
    frequency,
    numberId,
    address,
    phone,
    oldRegister,
    email,
    cityId,
    document,
    payday,
    dependents,
    payments,
  }: IRequest): Promise<void> {
    const city = await this.cityRepository.findById(cityId)

    if (!city) throw new AppError('City not found', 404)

    try {
      let code: string

      while (!code) {
        const codeGenerated = makeCode(8)

        const checkExistsTicketCode = await this.customerRepository.findByCode(
          codeGenerated,
        )

        if (!checkExistsTicketCode) code = codeGenerated
      }

      await this.customerRepository.create({
        name,
        code,
        silverPlan,
        numberId,
        frequency,
        oldRegister,
        address,
        email,
        phone,
        cityId,
        document,
        payday,
        dependents,
        payments,
      })
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default CreateCustomerUseCase
