import { classToClass } from 'class-transformer'

import Customer from '../infra/typeorm/entities/Customer'
import { IFindAllDebtorsResponseDTO } from '../dtos/IFindAllDebtorResponseDTO'

export class DebtorMap {
  static toDTO({
    id,
    name,
    silverPlan,
    address,
    email,
    document,
    payday,
    numberId,
    paymentCount,
  }: Customer): IFindAllDebtorsResponseDTO {
    const customer = classToClass({
      id,
      name,
      silverPlan,
      address,
      email,
      document,
      payday,
      numberId,
      paymentCount,
    })
    return customer
  }
}
