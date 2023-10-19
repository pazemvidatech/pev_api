import IPaymentRepository from '../repositories/IPaymentRepository'
import {
  SortQueryType,
  ColumnSortType,
  OrderQueryType,
} from '../types/SortQueryType'
import { injectable, inject } from 'tsyringe'
import Payment from '../infra/typeorm/entities/Payment'
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'

interface PaymentPerYear {
  year: number
  months: {
    month: number
    monthName: string
    amount: number
  }
}

@injectable()
class FindPaymentsCustomerUseCase {
  constructor(
    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(customerId: string): Promise<PaymentPerYear[]> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) throw new AppError('Customer not found', 404)

    const payments = await this.paymentRepository.findAllByCustomerId(
      customerId,
    )

    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]

    const outputData = []

    payments.forEach(item => {
      const existingYear = outputData.find(o => o.year === item.year)

      if (existingYear) {
        existingYear.months.push({
          month: item.month,
          monthName: monthNames[item.month - 1],
          amount: item.amount,
        })
      } else {
        outputData.push({
          year: item.year,
          months: [
            {
              month: item.month,
              monthName: monthNames[item.month - 1],
              amount: item.amount,
            },
          ],
        })
      }
    })

    // Sort years in ascending order
    outputData.sort((a, b) => a.year - b.year)

    // Sort months in ascending order for each year
    outputData.forEach(yearData => {
      yearData.months.sort(
        (a: { month: number }, b: { month: number }) => a.month - b.month,
      )
    })

    return outputData
  }
}

export default FindPaymentsCustomerUseCase
