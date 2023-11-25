import { ICreateCityRequestDTO } from '@modules/cities/dtos/ICreateCityDTO'
import ICityRepository from '@modules/cities/repositories/ICityRepository'
import { FindManyOptions, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'

import City from '../entities/City'
import { IFindAllCitiesResponseDTO } from '@modules/cities/dtos/IFindAllCitiesDTO'

class CityRepository implements ICityRepository {
  private ormRepository: Repository<City>
  constructor() {
    this.ormRepository = Datasource.getRepository(City)
  }

  async create(cityData: ICreateCityRequestDTO): Promise<City> {
    const city = this.ormRepository.create(cityData)

    return await this.ormRepository.save(city)
  }

  public async findAll(
    query: FindManyOptions<City>,
  ): Promise<IFindAllCitiesResponseDTO> {
    const result = await this.ormRepository.findAndCount(query)

    return { data: result[0], total: result[1] }
  }

  async findByName(name: string): Promise<City | undefined> {
    const city = await this.ormRepository.findOne({ where: { name } })

    return city
  }

  async findById(id: string): Promise<City | undefined> {
    const city = await this.ormRepository.findOneBy({ id })

    return city
  }

  async remove(city: City): Promise<City> {
    return await this.ormRepository.remove(city)
  }

  async save(city: City): Promise<City> {
    return await this.ormRepository.save(city)
  }
}

export default CityRepository
