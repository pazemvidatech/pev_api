import { classToClass } from 'class-transformer'

import { IFindAllCustomerResponseDTO } from '../dtos/IFindAllCustomerResponseDTO'
import Customer from '../infra/typeorm/entities/Customer'

export class CustomerMap {
  static toDTO({
    id,
    name,
    numberDependents,
    address,
    payday,
    numberId,
  }: Customer): IFindAllCustomerResponseDTO {
    const customer = classToClass({
      id,
      name,
      numberDependents,
      address,
      payday,
      numberId,
    })
    return customer
  }
}
