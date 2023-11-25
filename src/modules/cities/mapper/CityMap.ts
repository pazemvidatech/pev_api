import { classToClass } from 'class-transformer'

import City from '../infra/typeorm/entities/City'
import { IFindAllDataCitiesDTO } from '../dtos/IFindAllDataCitiesDTO'

export class CityMap {
  static toDTO({ id, name }: City): IFindAllDataCitiesDTO {
    const city = classToClass({
      id,
      name,
    })
    return city
  }
}
