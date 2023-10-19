import { inject, injectable } from 'tsyringe'

import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository'
import AppError from '@shared/errors/AppError'
import Customer from '../infra/typeorm/entities/Customer'
import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'
import {
  IShowDebtorResponseDTO,
  LatePaymentDTO,
  LatePaymentMonthDTO,
} from '../dtos/IShowDebtorResponseDTO'

@injectable()
class ShowDebtorUseCase {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  async execute(debtorId: string): Promise<IShowDebtorResponseDTO> {
    const customer = await this.customerRepository.findById(debtorId)

    if (!customer) throw new AppError('Customer not found', 404)

    const lastPayment = await this.paymentRepository.findLastPaymentByCustomer(
      customer.id,
    )

    let latePayments: LatePaymentDTO[] = []

    if (lastPayment) {
      // Calculate months and years in arrears starting from the last payment
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1 // +1 porque os meses são baseados em 0 (janeiro = 0)

      const lastPaymentMonth = lastPayment.month
      const lastPaymentYear = lastPayment.year

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
    return monthNames[month - 1]
  }
}

export default ShowDebtorUseCase
