export interface IUpdateCustomerRequestDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  silverPlan: boolean
  address: string
  payday: number
  numberId: string
}
