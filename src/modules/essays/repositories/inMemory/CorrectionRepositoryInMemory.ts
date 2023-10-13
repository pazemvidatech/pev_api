import ICorrectionRepository from '@modules/essays/repositories/ICorrectionRepository'

import Correction from '../../infra/typeorm/entities/Correction'
import ICreateCorrectionDTO from '@modules/essays/dtos/ICreateCorrectionDTO'
import {
  IFindAllCorrectionsRequestDTO,
  IFindAllCorrectionsResponseDTO,
} from '@modules/essays/dtos/IFindAllCorrectionsDTO'

class CorrectionRepositoryInMemory implements ICorrectionRepository {
  private corrections: Correction[] = []

  public async create(
    correctionData: ICreateCorrectionDTO,
  ): Promise<Correction> {
    const { essayId, prompt, completion } = correctionData
    const correction = new Correction()

    Object.assign(correction, {
      essayId,
      prompt,
      completion,
      createdAt: new Date(),
    })

    this.corrections.push(correction)

    return correction
  }

  public async findByEssayId(essayId: string): Promise<Correction> {
    const correction = this.corrections.find(
      correction => correction.essayId === essayId,
    )

    return correction
  }

  public async findById(id: string): Promise<Correction> {
    const correction = this.corrections.find(correction => correction.id === id)

    return correction
  }

  public async findAll(
    query: IFindAllCorrectionsRequestDTO,
  ): Promise<IFindAllCorrectionsResponseDTO> {
    const orderBy = query.order.createdAt
    const { take, skip } = query

    const start = this.corrections

    start.sort((a, b) => {
      const aCA = a.createdAt.getMilliseconds()
      const bCA = b.createdAt.getMilliseconds()
      switch (orderBy) {
        case 'ASC':
          return aCA - bCA
        case 'DESC':
          return bCA - aCA
      }
    })

    const corrections = start.slice(skip, skip + take)

    return { data: corrections, total: corrections.length }
  }

  public async save(correction: Correction): Promise<void> {
    const findIndex = this.corrections.findIndex(
      findCorrection => findCorrection === correction,
    )

    this.corrections[findIndex] = correction
  }

  public async remove(correction: Correction): Promise<void> {
    const findIndex = this.corrections.findIndex(
      correctionFinded => correctionFinded === correction,
    )

    this.corrections.splice(findIndex, 1)
  }
}

export default CorrectionRepositoryInMemory
