export interface ICreateCustomerRequestDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  code: string
  silverPlan: boolean
  oldRegister: boolean
  frequency: number
  cityId: string
  address: string
  payday: number
  numberId: string
  dependents: ICreateDependentRequestDTO[]
  payments?: ICreatePaymentRequestDTO[]
}

export interface ICreateDependentRequestDTO {
  name: string
  deathDate?: Date | undefined
  customerId?: string | undefined
}

export interface ICreatePaymentRequestDTO {
  amount: number
  month: number
  year: number
  customerId?: string | undefined
}
