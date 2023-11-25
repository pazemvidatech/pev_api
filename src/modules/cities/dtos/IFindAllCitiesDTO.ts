import City from '../infra/typeorm/entities/City'

export interface IFindAllCitiesDTO {
  take: number
  skip: number
}

export interface IFindAllCitiesResponseDTO {
  data: City[]
  total: number
}
