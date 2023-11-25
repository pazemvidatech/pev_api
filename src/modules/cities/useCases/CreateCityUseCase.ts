import { inject, injectable } from 'tsyringe'

import ICityRepository from '../repositories/ICityRepository'
import AppError from '@shared/errors/AppError'

interface IRequest {
  name: string
}

@injectable()
class CreateCityUseCase {
  constructor(
    @inject('CityRepository')
    private cityRepository: ICityRepository,
  ) {}

  async execute({ name }: IRequest): Promise<void> {
    const cityAlreadyExists = await this.cityRepository.findByName(name)

    if (cityAlreadyExists) throw new AppError('City name already exists', 409)

    await this.cityRepository.create({ name })
  }
}

export default CreateCityUseCase
