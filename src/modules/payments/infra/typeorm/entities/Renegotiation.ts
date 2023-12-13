import { Exclude } from 'class-transformer'
import Customer from '../../../../customers/infra/typeorm/entities/Customer'
import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { v4 as uuidV4 } from 'uuid'
import Account from '../../../../accounts/infra/typeorm/entities/Account'
import Payment from './Payment'

export const renegotiationTableName = 'renegotiations'

@Entity(renegotiationTableName)
class Renegotiation {
  @PrimaryColumn()
  id: string

  @Column()
  initialMonth: number

  @Column()
  initialYear: number

  @Column()
  finalMonth: number

  @Column()
  finalYear: number

  @Column()
  negotiator: string

  @Column()
  amount: number

  @OneToMany(() => Payment, payment => payment.renegotiation, {
    cascade: true,
  })
  payments: Payment[]

  @Exclude()
  @Column()
  customerId: string

  @ManyToOne(() => Customer, customer => customer.renegotiations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer

  @Exclude()
  @Column()
  accountId: string

  @ManyToOne(() => Account, account => account.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account

  @CreateDateColumn()
  createdAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export default Renegotiation
