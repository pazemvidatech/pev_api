import ICreateEssayDTO from '../dtos/ICreateEssayDTO'
import {
  IFindAllEssaysRequestDTO,
  IFindAllEssaysResponseDTO,
} from '../dtos/IFindAllEssaysDTO'
import Essay from '../infra/typeorm/entities/Essay'

export default interface IEssayRepository {
  create(essayData: ICreateEssayDTO): Promise<Essay>
  findByAccountIdAndToday(accountId: string): Promise<Essay | undefined>
  findById(id: string): Promise<Essay | undefined>
  findByIdRelations(id: string): Promise<Essay | undefined>
  findAll(query: IFindAllEssaysRequestDTO): Promise<IFindAllEssaysResponseDTO>
  save(essay: Essay): Promise<void>
  remove(essay: Essay): Promise<void>
}
