import { ICreateCustomerRequestDTO } from '@modules/customers/dtos/ICreateCustomerDTO'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import { FindManyOptions, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import { v4 as uuidV4 } from 'uuid'
import Customer from '../entities/Customer'
import { IFindAllCustomersResponseDTO } from '@modules/customers/dtos/IFindAllCustomersDTO'
import Dependent from '../entities/Dependent'

class CustomerRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>
  private ormDependentRepository: Repository<Dependent>
  constructor() {
    this.ormRepository = Datasource.getRepository(Customer)
    this.ormDependentRepository = Datasource.getRepository(Dependent)
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

  public async findAllDebtors(
    query: FindManyOptions<Customer> = {},
    search?: string | undefined,
  ): Promise<IFindAllCustomersResponseDTO> {
    const { skip, take } = query

    console.log(search)

    const nameFilter = search
      ? ` AND LOWER("customers"."name") LIKE LOWER('%${search}%')`
      : ''

    console.log(nameFilter)

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1 // getMonth() retorna o mês de 0 a 11, então adicionamos 1 para obter de 1 a 12

    const data = await this.ormRepository.query(`
      SELECT "customers".*, 
        (${currentYear} - MAX("payments"."year")) * 12 + ${currentMonth} - MAX("payments"."month") AS "paymentCount"
      FROM "customers"
      LEFT JOIN "payments" ON "payments"."customerId" = "customers"."id"
      WHERE 1 = 1 ${nameFilter}
      GROUP BY "customers"."id"
      HAVING (${currentYear} - MAX("payments"."year")) * 12 + ${currentMonth} - MAX("payments"."month") >= 2
      ORDER BY "paymentCount" DESC
      LIMIT ${take} OFFSET ${skip}
    `)

    const total = await this.ormRepository.query(`
      SELECT COUNT(*) AS "count"
      FROM (
        SELECT 1
        FROM "customers"
        LEFT JOIN "payments" ON "payments"."customerId" = "customers"."id"
        WHERE 1 = 1 ${nameFilter}
        GROUP BY "customers"."id"
        HAVING (${currentYear} - MAX("payments"."year")) * 12 + ${currentMonth} - MAX("payments"."month") >= 2
      ) AS "sub"
    `)

    return { data, total: Number(total[0].count) }
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
