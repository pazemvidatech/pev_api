export interface IFindAllDebtorsResponseDTO {
  id: string
  name: string
  silverPlan: boolean
  address: string
  email: string
  document: string
  payday: number
  numberId: string
  paymentCount(): number
}
