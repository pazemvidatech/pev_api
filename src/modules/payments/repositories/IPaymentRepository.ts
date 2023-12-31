import ICreateOldPaymentsDTO from '../dtos/ICreateOldPaymentsDTO'
import ICreatePaymentDTO from '../dtos/ICreatePaymentDTO'
import {
  IFindAllPaymentsDTO,
  IFindAllPaymentsResponseDTO,
  PaymentList,
} from '../dtos/IFindAllPaymentsDTO'
import Payment from '../infra/typeorm/entities/Payment'

export default interface IPaymentRepository {
  create(dataPayment: ICreatePaymentDTO): Promise<Payment[]>
  createList(dataPayment: ICreateOldPaymentsDTO[]): Promise<Payment[]>
  findById(id: string): Promise<PaymentList | undefined>
  findEntityById(id: string): Promise<Payment | undefined>
  findAllByCustomerId(customerId: string): Promise<Payment[]>
  findLastPaymentByCustomer(customerId: string): Promise<Payment | undefined>
  findAll(data: IFindAllPaymentsDTO): Promise<IFindAllPaymentsResponseDTO>
  remove(subscription: Payment): Promise<void>
  save(subscription: Payment): Promise<void>
}
