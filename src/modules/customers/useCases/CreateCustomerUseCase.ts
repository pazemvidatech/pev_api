import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import ICustomerRepository from '../repositories/ICustomerRepository'
import { ICreateDependentRequestDTO } from '../dtos/ICreateCustomerDTO'
import ICityRepository from '@modules/cities/repositories/ICityRepository'

interface IRequest {
  name: string
  email?: string | undefined
  document?: string | undefined
  silverPlan: boolean
  address: string
  cityId: string
  payday: number
  numberId: string
  dependents: ICreateDependentRequestDTO[]
}

function makeCode(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
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
    numberId,
    address,
    email,
    cityId,
    document,
    payday,
    dependents,
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
        address,
        email,
        cityId,
        document,
        payday,
        dependents,
      })
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }
}

export default CreateCustomerUseCase
