import { ICreateCustomerRequestDTO } from '@modules/customers/dtos/ICreateCustomerDTO'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import { FindManyOptions, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'

import Customer from '../entities/Customer'
import { IFindAllCustomersResponseDTO } from '@modules/customers/dtos/IFindAllCustomersDTO'

class CustomerRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>
  constructor() {
    this.ormRepository = Datasource.getRepository(Customer)
  }

  async create(customerData: ICreateCustomerRequestDTO): Promise<Customer> {
    const customer = this.ormRepository.create(customerData)

    return await this.ormRepository.save(customer)
  }

  public async findAll(
    query: FindManyOptions<Customer>,
  ): Promise<IFindAllCustomersResponseDTO> {
    const result = await this.ormRepository.findAndCount(query)

    return { data: result[0], total: result[1] }
  }

  async findByCode(code: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({ where: { code } })

    return customer
  }

  async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOneBy({ id })

    return customer
  }

  async remove(customer: Customer): Promise<Customer> {
    return await this.ormRepository.remove(customer)
  }

  async save(customer: Customer): Promise<Customer> {
    return await this.ormRepository.save(customer)
  }
}

export default CustomerRepository
