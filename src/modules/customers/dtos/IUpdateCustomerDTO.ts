import Dependent from '../infra/typeorm/entities/Dependent'

export interface IUpdateCustomerRequestDTO {
  name: string
  email?: string | undefined
  document?: string | undefined
  phone?: string | undefined
  silverPlan: boolean
  address: string
  cityId: string
  payday: number
  numberId: string
  dependents: Dependent[]
}
