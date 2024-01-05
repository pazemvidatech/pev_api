import { DataSource, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'
import { addMonths } from 'date-fns'

import Payment from '../entities/Payment'
import ICreatePaymentDTO from '@modules/payments/dtos/ICreatePaymentDTO'
import {
  IFindAllPaymentsDTO,
  IFindAllPaymentsResponseDTO,
  PaymentList,
} from '@modules/payments/dtos/IFindAllPaymentsDTO'
import Customer from '@modules/customers/infra/typeorm/entities/Customer'
import ICreateOldPaymentsDTO from '@modules/payments/dtos/ICreateOldPaymentsDTO'

class PaymentRepository implements IPaymentRepository {
  private ormRepository: Repository<Payment>
  private connection: DataSource

  constructor() {
    this.connection = Datasource
    this.ormRepository = Datasource.getRepository(Payment)
  }

  public async create(paymentData: ICreatePaymentDTO): Promise<Payment[]> {
    const { customerId, accountId, amount, quantity } = paymentData
    return await this.connection.transaction(async entityManager => {
      const paymentsToCreate: Payment[] = []

      const lastPayment = await entityManager
        .createQueryBuilder(Payment, 'payment')
        .where('payment.customerId = :customerId', {
          customerId,
        })
        .orderBy('payment.year', 'DESC')

        .addOrderBy('payment.month', 'DESC')
        .limit(1)
        .getOne()

      let newMonth: number, newYear: number

      if (lastPayment) {
        newMonth = lastPayment.month
        newYear = lastPayment.year
      } else {
        const customerData = await entityManager.findOne(Customer, {
          where: { id: customerId },
        })
        const createdAtCustomer = customerData.createdAt
        const newDate = addMonths(createdAtCustomer, 1)

        newMonth = newDate.getMonth()

        newYear = newDate.getFullYear()
      }

      for (let i = 0; i < quantity; i++) {
        newMonth++
        if (newMonth > 12) {
          newMonth = 1
          newYear++
        }

        const now = new Date()

        now.setSeconds(now.getSeconds() + i)

        const newPayment = new Payment()
        newPayment.month = newMonth
        newPayment.year = newYear
        newPayment.amount = Number(amount)
        newPayment.customerId = customerId
        newPayment.accountId = accountId
        newPayment.createdAt = now
        paymentsToCreate.push(newPayment)
      }

      console.log(paymentsToCreate)

      await entityManager.save(paymentsToCreate)

      return paymentsToCreate
    })
  }

  public async createList(
    paymentsData: ICreateOldPaymentsDTO[],
  ): Promise<Payment[]> {
    return await this.connection.transaction(async entityManager => {
      let paymentsToCreate: Payment[] = []

      for (let i = 0; i < paymentsData.length; i++) {
        const item = paymentsData[i]

        const now = new Date()

        now.setSeconds(now.getSeconds() + i)

        const newPayment = new Payment()
        newPayment.month = item.month
        newPayment.year = item.year
        newPayment.amount = Number(item.amount)
        newPayment.customerId = item.customerId
        newPayment.createdAt = now

        paymentsToCreate.push(newPayment)
      }

      await entityManager.save(paymentsToCreate)

      return paymentsToCreate
    })
  }

  public async findLastPaymentByCustomer(
    customerId: string,
  ): Promise<Payment | undefined> {
    const lastPayment = await this.ormRepository
      .createQueryBuilder('payment')
      .where('payment.customerId = :customerId', {
        customerId,
      })
      .orderBy('payment.year', 'DESC')

      .addOrderBy('payment.month', 'DESC')
      .limit(1)
      .getOne()

    return lastPayment
  }

  public async findById(id: string): Promise<PaymentList | undefined> {
    const result = await this.ormRepository
      .createQueryBuilder('payment')
      .select([
        'payment.id',
        'payment.month',
        'payment.year',
        'payment.amount',
        'payment.renegotiationId',
        'payment.createdAt',
        'customer.name AS customerName',
        'account.name AS accountName',
      ])
      .leftJoin('payment.customer', 'customer')
      .leftJoin('payment.account', 'account')
      .where('payment.id = :id', { id })
      .getRawOne()

    if (!result) {
      return undefined
    }

    const camelCaseData = {
      id: result.payment_id,
      month: result.payment_month,
      year: result.payment_year,
      renegotiationId: result.payment_renegotiationId,
      amount: result.payment_amount,
      createdAt: result.payment_createdAt,
      customerName: result.customername,
      accountName: result.accountname,
    }

    return camelCaseData
  }

  public async findEntityById(id: string): Promise<Payment | undefined> {
    const result = await this.ormRepository.findOne({ where: { id } })

    return result
  }

  public async findAllByCustomerId(customerId: string): Promise<Payment[]> {
    const payments = await this.ormRepository.find({
      where: { customerId },
    })

    return payments
  }

  public async findAll(
    query: IFindAllPaymentsDTO,
  ): Promise<IFindAllPaymentsResponseDTO> {
    const { month, year, order, skip, take, where } = query

    const qb = this.ormRepository
      .createQueryBuilder('payment')
      .select([
        'payment.id',
        'payment.month',
        'payment.year',
        'payment.amount',
        'payment.createdAt',
        'payment.renegotiationId',
        'customer.name AS customerName',
        'account.name AS accountName',
      ])
      .leftJoin('payment.customer', 'customer')
      .leftJoin('payment.account', 'account')

    if (where?.accountId) {
      qb.andWhere('payment.accountId = :accountId', {
        accountId: where.accountId,
      })
    }

    if (month) {
      qb.andWhere(`EXTRACT(MONTH FROM payment."createdAt") = :month`, {
        month,
      })
    }

    if (year) {
      qb.andWhere(`EXTRACT(YEAR FROM payment."createdAt") = :year`, { year })
    }

    // Obter a contagem total de pagamentos que correspondem à condição da conta.
    const total = await qb.getCount()

    // Aplicar paginação após obter a contagem.
    qb.skip(skip).take(take)

    if (order) {
      qb.orderBy(`payment.${Object.keys(order)[0]}`, Object.values(order)[0])
    }

    const data = await qb.getRawMany()

    const camelCaseData = data.map(result => ({
      id: result.payment_id,
      month: result.payment_month,
      year: result.payment_year,
      amount: result.payment_amount,
      createdAt: result.payment_createdAt,
      renegotiationId: result.payment_renegotiationId,
      customerName: result.customername,
      accountName: result.accountname,
    }))

    return {
      data: camelCaseData,
      total,
    }
  }

  public async remove(payment: Payment): Promise<void> {
    await this.ormRepository.remove(payment)
  }

  public async save(payment: Payment): Promise<void> {
    await this.ormRepository.save(payment)
  }
}

export default PaymentRepository
