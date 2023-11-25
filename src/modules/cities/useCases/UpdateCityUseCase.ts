import { inject, injectable } from 'tsyringe'

import ICityRepository from '../repositories/ICityRepository'
import AppError from '@shared/errors/AppError'

interface IRequest {
  cityId: string
  name: string
}

@injectable()
class UpdateCityUseCase {
  constructor(
    @inject('CityRepository')
    private cityRepository: ICityRepository,
  ) {}

  async execute({ name, cityId }: IRequest): Promise<void> {
    const city = await this.cityRepository.findById(cityId)

    if (!city) throw new AppError('City not found', 409)

    const cityAlreadyExists = await this.cityRepository.findByName(name)

    if (cityAlreadyExists) throw new AppError('City name already exists', 409)

    city.name = name

    await this.cityRepository.save(city)
  }
}

export default UpdateCityUseCase
