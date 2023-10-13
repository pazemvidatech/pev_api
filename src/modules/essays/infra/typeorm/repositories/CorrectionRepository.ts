import { Repository } from 'typeorm'

import Datasource from '@shared/infra/typeorm'
import ICorrectionRepository from '@modules/essays/repositories/ICorrectionRepository'

import Correction from '../entities/Correction'
import ICreateCorrectionDTO from '@modules/essays/dtos/ICreateCorrectionDTO'
import {
  IFindAllCorrectionsRequestDTO,
  IFindAllCorrectionsResponseDTO,
} from '@modules/essays/dtos/IFindAllCorrectionsDTO'

class CorrectionRepository implements ICorrectionRepository {
  private ormRepository: Repository<Correction>

  constructor() {
    this.ormRepository = Datasource.getRepository(Correction)
  }

  public async create(essayData: ICreateCorrectionDTO): Promise<Correction> {
    const essayCreate = this.ormRepository.create(essayData)

    return await this.ormRepository.save(essayCreate)
  }

  public async findById(id: string): Promise<Correction | undefined> {
    const essay = await this.ormRepository.findOne({ where: { id } })

    return essay
  }

  public async findByEssayId(essayId: string): Promise<Correction | undefined> {
    const essay = await this.ormRepository.findOne({ where: { essayId } })

    return essay
  }

  public async findByAccountIdAndTodayDate(
    accountId: string,
  ): Promise<Correction | undefined> {
    const today = new Date()
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )

    const essay = await this.ormRepository
      .createQueryBuilder('essay')
      .where('essay.accountID = :accountID', { accountId })
      .andWhere('essay.createdAt >= :startOfDay', { startOfDay })
      .andWhere('essay.createdAt < :tomorrow', {
        tomorrow: new Date(today.getTime() + 86400000),
      })
      .getOne()
    return essay
  }

  public async findAll(
    query: IFindAllCorrectionsRequestDTO,
  ): Promise<IFindAllCorrectionsResponseDTO> {
    const result = await this.ormRepository.findAndCount(query)

    return { data: result[0], total: result[1] }
  }

  public async save(essay: Correction): Promise<void> {
    await this.ormRepository.save(essay)
  }

  public async remove(essay: Correction): Promise<void> {
    await this.ormRepository.remove(essay)
  }
}

export default CorrectionRepository
