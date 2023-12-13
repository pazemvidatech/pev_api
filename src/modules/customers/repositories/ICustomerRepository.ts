import { ICreateCustomerRequestDTO } from '../dtos/ICreateCustomerDTO'
import {
  IFindAllCustomersDTO,
  IFindAllCustomersResponseDTO,
} from '../dtos/IFindAllCustomersDTO'
import Customer from '../infra/typeorm/entities/Customer'

export default interface ICustomerRepository {
  create(customerData: ICreateCustomerRequestDTO): Promise<Customer>
  findAll(data: IFindAllCustomersDTO): Promise<IFindAllCustomersResponseDTO>
  findAllDebtors(
    data: IFindAllCustomersDTO,
    search?: string | undefined,
  ): Promise<IFindAllCustomersResponseDTO>
  findByCode(email: string): Promise<Customer | undefined>
  findById(customerId: string): Promise<Customer | undefined>
  findPaymentCountByCustomerId(customerId: string): Promise<number>
  remove(customer: Customer): Promise<Customer>
  save(customer: Customer): Promise<Customer>
}
