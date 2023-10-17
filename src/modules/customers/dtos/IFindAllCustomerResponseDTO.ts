export interface IFindAllCustomerResponseDTO {
  id: string
  name: string
  numberDependents(): number
  address: string
  payday: number
  numberId: string
}
