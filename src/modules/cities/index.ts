import { container } from 'tsyringe'

import ICityRepository from '../cities/repositories/ICityRepository'
import CityRepository from '../cities/infra/typeorm/repositories/CityRepository'

container.registerSingleton<ICityRepository>('CityRepository', CityRepository)
