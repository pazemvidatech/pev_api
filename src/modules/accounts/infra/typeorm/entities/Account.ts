import Renegotiation from '@modules/payments/infra/typeorm/entities/Renegotiation'
import Payment from '../../../../payments/infra/typeorm/entities/Payment'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

export const accountTableName = 'accounts'

@Entity(accountTableName)
class Account {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  username: string

  @Column()
  role: number

  @OneToMany(() => Payment, payment => payment.customer)
  payments: Payment[]

  @OneToMany(() => Renegotiation, renegotiation => renegotiation.customer)
  renegotiations: Renegotiation[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export default Account
