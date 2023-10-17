import { DataSource, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'

import Payment from '../entities/Payment'
import ICreatePaymentDTO from '@modules/payments/dtos/ICreatePaymentDTO'
import Account from '@modules/accounts/infra/typeorm/entities/Account'
import {
  IFindAllPaymentsDTO,
  IFindAllPaymentsResponseDTO,
} from '@modules/payments/dtos/IFindAllPaymentsDTO'
import { classToPlain } from 'class-transformer'

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
        const currentDate = new Date()
        newMonth = currentDate.getMonth()
        newYear = currentDate.getFullYear()
      }

      for (let i = 0; i < quantity; i++) {
        newMonth++
        if (newMonth > 12) {
          newMonth = 1
          newYear++
        }

        const newPayment = new Payment()
        newPayment.month = newMonth
        newPayment.year = newYear
        newPayment.amount = Number(amount)
        newPayment.customerId = customerId
        newPayment.accountId = accountId

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

  public async findById(id: string): Promise<Payment | undefined> {
    const Payment = await this.ormRepository.findOne({
      where: { id },
    })

    return Payment
  }

  public async findByAccountId(
    accountId: string,
  ): Promise<Payment | undefined> {
    const Payment = await this.ormRepository.findOne({
      where: { accountId },
    })

    return Payment
  }

  public async findAll(
    query: IFindAllPaymentsDTO,
  ): Promise<IFindAllPaymentsResponseDTO> {
    const payments = await this.ormRepository.findAndCount(query)

    return {
      data: classToPlain(payments[0]) as Payment[],
      total: payments[1],
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
