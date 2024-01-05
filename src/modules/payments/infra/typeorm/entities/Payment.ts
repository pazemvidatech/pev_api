import { Exclude } from 'class-transformer'
import Customer from '../../../../customers/infra/typeorm/entities/Customer'
import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'

import { v4 as uuidV4 } from 'uuid'
import Account from '../../../../accounts/infra/typeorm/entities/Account'
import Renegotiation from './Renegotiation'

export const paymentTableName = 'payments'

@Entity(paymentTableName)
class Payment {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  renegotiationId: string | undefined

  @ManyToOne(() => Renegotiation, renegotiation => renegotiation.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'renegotiationId' })
  renegotiation: Renegotiation

  @Column()
  month: number

  @Column()
  year: number

  @Column()
  amount: number

  @Exclude()
  @Column()
  customerId: string

  @ManyToOne(() => Customer, customer => customer.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer

  @Exclude()
  @Column({ nullable: true })
  accountId?: string | undefined

  @ManyToOne(() => Account, account => account.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account | undefined

  @CreateDateColumn()
  createdAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export default Payment
