import { container } from 'tsyringe'

import IEssayRepository from '../essays/repositories/IEssayRepository'
import EssayRepository from '../essays/infra/typeorm/repositories/EssayRepository'

import ICorrectionRepository from '../essays/repositories/ICorrectionRepository'
import CorrectionRepository from '../essays/infra/typeorm/repositories/CorrectionRepository'

container.registerSingleton<IEssayRepository>(
  'EssayRepository',
  EssayRepository,
)

container.registerSingleton<ICorrectionRepository>(
  'CorrectionRepository',
  CorrectionRepository,
)
