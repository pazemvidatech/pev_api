import { DataSource, Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'
import IRenegotiationRepository from '@modules/payments/repositories/IRenegotiationRepository'
import { addMonths, differenceInMonths, subMonths } from 'date-fns'

import Renegotiation from '../entities/Renegotiation'
import ICreateRenegotiationDTO from '@modules/payments/dtos/ICreateRenegotiationDTO'
import Customer from '@modules/customers/infra/typeorm/entities/Customer'
import Payment from '../entities/Payment'

class RenegotiationRepository implements IRenegotiationRepository {
  private ormRepository: Repository<Renegotiation>
  private connection: DataSource

  constructor() {
    this.connection = Datasource
    this.ormRepository = Datasource.getRepository(Renegotiation)
  }

  public async create(
    paymentData: ICreateRenegotiationDTO,
  ): Promise<Renegotiation> {
    const { customerId, accountId, negotiator, amount } = paymentData
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

      let initialMonth: number,
        initialYear: number,
        finalMonth: number,
        finalYear: number

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

      const firstDate = new Date(newYear, newMonth)
      const nowDate = new Date()

      const quantityMonths = differenceInMonths(nowDate, firstDate)

      for (let i = 0; i < quantityMonths; i++) {
        newMonth++

        if (i === 0) {
          initialMonth = newMonth
          initialYear = newYear
        }

        if (newMonth > 12) {
          newMonth = 1
          newYear++
        }

        if (i === quantityMonths - 1) {
          finalMonth = newMonth
          finalYear = newYear
        }

        const now = new Date()

        now.setSeconds(now.getSeconds() + i)

        const newPayment = new Payment()
        newPayment.month = newMonth
        newPayment.year = newYear
        newPayment.amount = Number((amount / quantityMonths).toPrecision(2))
        newPayment.customerId = customerId
        newPayment.accountId = accountId
        newPayment.createdAt = now
        paymentsToCreate.push(newPayment)
      }

      const newRenegotiation = new Renegotiation()
      newRenegotiation.initialMonth = initialMonth
      newRenegotiation.initialYear = initialYear
      newRenegotiation.finalMonth = finalMonth
      newRenegotiation.finalYear = finalYear
      newRenegotiation.amount = Number(amount)
      newRenegotiation.negotiator = negotiator
      newRenegotiation.customerId = customerId
      newRenegotiation.accountId = accountId

      const renegotiationCreated = await entityManager.save(
        Renegotiation,
        newRenegotiation,
      )

      for (let index = 0; index < paymentsToCreate.length; index++) {
        const item = paymentsToCreate[index]

        item.renegotiationId = renegotiationCreated.id
      }

      await entityManager.save(paymentsToCreate)

      return renegotiationCreated
    })
  }

  public async findById(id: string): Promise<Renegotiation | undefined> {
    const renegotiation = await this.ormRepository.findOne({
      where: { id },
    })

    return renegotiation
  }

  public async findAllByCustomerId(
    customerId: string,
  ): Promise<Renegotiation[]> {
    const renegotiations = await this.ormRepository.find({
      where: { customerId },
    })

    return renegotiations
  }

  public async remove(payment: Renegotiation): Promise<void> {
    await this.ormRepository.remove(payment)
  }

  public async save(payment: Renegotiation): Promise<void> {
    await this.ormRepository.save(payment)
  }
}

export default RenegotiationRepository
