import { classToClass } from 'class-transformer'

import { IProfileCityResponseDTO } from '../dtos/IProfileCityDTO'
import City from '../infra/typeorm/entities/City'

export class CityMap {
  static toDTO({
    id,
    email,
    name,
    username,
    role,
  }: City): IProfileCityResponseDTO {
    const city = classToClass({
      id,
      name,
      email,
      username,
      role,
    })
    return city
  }
}
