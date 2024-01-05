import ICreateOldRenegotiationDTO from '../dtos/ICreateOldRenegotiationDTO'
import ICreateRenegotiationDTO from '../dtos/ICreateRenegotiationDTO'
import Renegotiation from '../infra/typeorm/entities/Renegotiation'

export default interface IRenegotiationRepository {
  create(dataRenegotiation: ICreateRenegotiationDTO): Promise<Renegotiation>
  createWithDates(
    dataRenegotiation: ICreateOldRenegotiationDTO,
  ): Promise<Renegotiation>
  findById(id: string): Promise<Renegotiation | undefined>
  findAllByCustomerId(customerId: string): Promise<Renegotiation[]>
  remove(subscription: Renegotiation): Promise<void>
  save(subscription: Renegotiation): Promise<void>
}
