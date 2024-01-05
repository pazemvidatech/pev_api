export interface LatePaymentMonthDTO {
  month: number
  monthName: string
}

export interface LatePaymentDTO {
  year: number
  months: LatePaymentMonthDTO[]
}

export interface IShowCustomerByCodeResponseDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  phone?: string | undefined
  silverPlan: boolean
  address: string
  payday: number
  numberId: string
  latePayments: LatePaymentDTO[]
  nextPayment: INextPayment
}

export interface INextPayment {
  month: number
  monthName: string
  year: number
}
