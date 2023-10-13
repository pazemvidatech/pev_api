import ICreateCorrectionDTO from '../dtos/ICreateCorrectionDTO'
import {
  IFindAllCorrectionsRequestDTO,
  IFindAllCorrectionsResponseDTO,
} from '../dtos/IFindAllCorrectionsDTO'
import Correction from '../infra/typeorm/entities/Correction'

export default interface ICorrectionRepository {
  create(essayData: ICreateCorrectionDTO): Promise<Correction>
  findById(id: string): Promise<Correction | undefined>
  findByEssayId(essayId: string): Promise<Correction | undefined>
  findAll(
    query: IFindAllCorrectionsRequestDTO,
  ): Promise<IFindAllCorrectionsResponseDTO>
  save(essay: Correction): Promise<void>
  remove(essay: Correction): Promise<void>
}
