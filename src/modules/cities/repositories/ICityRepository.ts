import { ICreateCityRequestDTO } from '../dtos/ICreateCityDTO'
import {
  IFindAllCitiesDTO,
  IFindAllCitiesResponseDTO,
} from '../dtos/IFindAllCitiesDTO'
import City from '../infra/typeorm/entities/City'

export default interface ICityRepository {
  create(cityData: ICreateCityRequestDTO): Promise<City>
  findAll(data: IFindAllCitiesDTO): Promise<IFindAllCitiesResponseDTO>
  findByName(name: string): Promise<City | undefined>
  findById(city_id: string): Promise<City | undefined>
  remove(city: City): Promise<City>
  save(city: City): Promise<City>
}
