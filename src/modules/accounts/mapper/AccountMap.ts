import { classToClass } from 'class-transformer'

import { IProfileAccountResponseDTO } from '../dtos/IProfileAccountDTO'
import Account from '../infra/typeorm/entities/Account'

export class AccountMap {
  static toDTO({
    id,
    email,
    name,
    username,
    role,
  }: Account): IProfileAccountResponseDTO {
    const account = classToClass({
      id,
      name,
      email,
      username,
      role,
    })
    return account
  }
}
