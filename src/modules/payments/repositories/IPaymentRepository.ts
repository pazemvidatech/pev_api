import ICreatePaymentDTO from '../dtos/ICreatePaymentDTO'
import {
  IFindAllPaymentsDTO,
  IFindAllPaymentsResponseDTO,
} from '../dtos/IFindAllPaymentsDTO'
import Payment from '../infra/typeorm/entities/Payment'

export default interface IPaymentRepository {
  create(dataPayment: ICreatePaymentDTO): Promise<Payment[]>
  findById(id: string): Promise<Payment | undefined>
  findLastPaymentByCustomer(customerId: string): Promise<Payment | undefined>
  findAll(data: IFindAllPaymentsDTO): Promise<IFindAllPaymentsResponseDTO>
  remove(subscription: Payment): Promise<void>
  save(subscription: Payment): Promise<void>
}
