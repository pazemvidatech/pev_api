export interface LatePaymentMonthDTO {
  month: number
  monthName: string
}

export interface LatePaymentDTO {
  year: number
  months: LatePaymentMonthDTO[]
}

export interface IShowDebtorResponseDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  silverPlan: boolean
  address: string
  payday: number
  numberId: string
  latePayments: LatePaymentDTO[]
}
