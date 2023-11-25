import ICityRepository from '../repositories/ICityRepository'
import { IFindAllCitiesDTO } from '../dtos/IFindAllCitiesDTO'
import { injectable, inject } from 'tsyringe'
import City from '../infra/typeorm/entities/City'

interface IRequest {
  page: number
  size: number
}

interface IResponse {
  size: number
  page: number
  total: number
  data: City[]
}

@injectable()
class FindAllCitiesUseCase {
  constructor(
    @inject('CityRepository')
    private cityRepository: ICityRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { page, size } = data

    const queryData = {} as IFindAllCitiesDTO

    queryData.take = size
    queryData.skip = (page - 1) * size

    const result = await this.cityRepository.findAll(queryData)

    return {
      size,
      page,
      ...result,
    }
  }
}

export default FindAllCitiesUseCase
