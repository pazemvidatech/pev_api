export interface ICreateCustomerRequestDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  code: string
  silverPlan: boolean
  address: string
  payday: number
  numberId: string
  dependents: ICreateDependentRequestDTO[]
}

export interface ICreateDependentRequestDTO {
  name: string
  deathDate?: Date | undefined
  customerId?: string | undefined
}