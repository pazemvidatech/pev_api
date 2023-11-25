import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import ICityRepository from '../repositories/ICityRepository'

@injectable()
class DeleteCityUseCase {
  constructor(
    @inject('CityRepository')
    private cityRepository: ICityRepository,
  ) {}

  async execute(cityId: string): Promise<void> {
    const city = await this.cityRepository.findById(cityId)

    if (!city) throw new AppError('City not found', 404)

    await this.cityRepository.remove(city)
  }
}

export default DeleteCityUseCase
