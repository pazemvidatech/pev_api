import { ICreateCustomerRequestDTO } from '../dtos/ICreateCustomerDTO'
import {
  IFindAllCustomersDTO,
  IFindAllCustomersResponseDTO,
} from '../dtos/IFindAllCustomersDTO'
import Customer from '../infra/typeorm/entities/Customer'

export default interface ICustomerRepository {
  create(customerData: ICreateCustomerRequestDTO): Promise<Customer>
  findAll(data: IFindAllCustomersDTO): Promise<IFindAllCustomersResponseDTO>
  findByCode(email: string): Promise<Customer | undefined>
  findById(customer_id: string): Promise<Customer | undefined>
  remove(customer: Customer): Promise<Customer>
  save(customer: Customer): Promise<Customer>
}
