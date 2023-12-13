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

  public async findPaymentCountByCustomerId(
    customerId: string,
  ): Promise<number> {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const result = await this.ormRepository.query(`
      SELECT
        COALESCE(
          ((${currentYear} * 12 + ${currentMonth}) - (MAX("payments"."year") * 12 + MAX("payments"."month") + 1)) - "customers"."frequency",
          ((${currentYear} * 12 + ${currentMonth}) - ((EXTRACT(YEAR FROM "customers"."createdAt") * 12 + EXTRACT(MONTH FROM "customers"."createdAt")) + 1)) - "customers"."frequency"
        ) AS "paymentCount"
      FROM "customers"
      LEFT JOIN "payments" ON "payments"."customerId" = "customers"."id"
      WHERE "customers"."id" = ${customerId}
      GROUP BY "customers"."id"
    `)

    return result.length > 0 ? Number(result[0].paymentCount) : 0
  }

  public async findAllDebtors(
    query: FindManyOptions<Customer> = {},
    search?: string | undefined,
  ): Promise<IFindAllCustomersResponseDTO> {
    const { skip, take } = query

    const nameFilter = search
      ? ` AND LOWER("customers"."name") LIKE LOWER('%${search.replace(
          /'/g,
          "''",
        )}%')`
      : ''

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const data = await this.ormRepository.query(`
      SELECT "customers".*,
        COALESCE(
          ((${currentYear} * 12 + ${currentMonth}) - (MAX("payments"."year") * 12 + MAX("payments"."month") + 1)) - "customers"."frequency",
          ((${currentYear} * 12 + ${currentMonth}) - ((EXTRACT(YEAR FROM "customers"."createdAt") * 12 + EXTRACT(MONTH FROM "customers"."createdAt")) + 1)) - "customers"."frequency"
        ) AS "paymentCount"
      FROM "customers"
      LEFT JOIN "payments" ON "payments"."customerId" = "customers"."id"
      WHERE 1 = 1 ${nameFilter}
      GROUP BY "customers"."id"
      HAVING COALESCE(
        (${currentYear} * 12 + ${currentMonth}) - (MAX("payments"."year") * 12 + MAX("payments"."month") + 1),
        (${currentYear} * 12 + ${currentMonth}) - ((EXTRACT(YEAR FROM "customers"."createdAt") * 12 + EXTRACT(MONTH FROM "customers"."createdAt")) + 1)
      ) > "customers"."frequency"
      ORDER BY "paymentCount" DESC
      LIMIT ${take} OFFSET ${skip}
    `)

    const total = await this.ormRepository.query(`
      SELECT COUNT(*) AS "count"
      FROM (
        SELECT "customers"."id"
        FROM "customers"
        LEFT JOIN "payments" ON "payments"."customerId" = "customers"."id"
        WHERE 1 = 1 ${nameFilter}
        GROUP BY "customers"."id"
        HAVING COALESCE(
          (${currentYear} * 12 + ${currentMonth}) - (MAX("payments"."year") * 12 + MAX("payments"."month") + 1),
          (${currentYear} * 12 + ${currentMonth}) - ((EXTRACT(YEAR FROM "customers"."createdAt") * 12 + EXTRACT(MONTH FROM "customers"."createdAt")) + 1)
        ) > "customers"."frequency"
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
