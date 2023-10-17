import { inject, injectable } from 'tsyringe'

import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'
import Customer from '../infra/typeorm/entities/Customer'
import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'
import {
  IShowCustomerByCodeResponseDTO,
  LatePaymentDTO,
  LatePaymentMonthDTO,
} from '../dtos/IShowCustomerByCodeResponseDTO'
import Payment from '@modules/payments/infra/typeorm/entities/Payment'

@injectable()
class ShowCustomerByCodeUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  async execute(code: string): Promise<IShowCustomerByCodeResponseDTO> {
    const customer = await this.customerRepository.findByCode(code)

    if (!customer) throw new AppError('Customer not found', 404)

    const lastPayment = await this.paymentRepository.findLastPaymentByCustomer(
      customer.id,
    )

    // Calculate months and years in arrears starting from the last payment
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1 // +1 porque os meses são baseados em 0 (janeiro = 0)

    const lastPaymentMonth = lastPayment.month
    const lastPaymentYear = lastPayment.year

    const latePayments: LatePaymentDTO[] = []
    for (let year = lastPaymentYear; year <= currentYear; year++) {
      const startMonth = year === lastPaymentYear ? lastPaymentMonth + 1 : 1
      const endMonth = year === currentYear ? currentMonth : 12

      const monthsForYear: LatePaymentMonthDTO[] = []
      for (let month = startMonth; month <= endMonth; month++) {
        const monthName = this.getMonthName(month) // Função para obter o nome do mês
        monthsForYear.push({ month, monthName })
      }

      latePayments.push({ year, months: monthsForYear })
    }

    return {
      ...customer,
      latePayments,
    }
  }

  private getMonthName(month: number): string {
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
    return monthNames[month - 1] // Subtrai 1 para corresponder ao índice do array
  }
}

export default ShowCustomerByCodeUseCase
