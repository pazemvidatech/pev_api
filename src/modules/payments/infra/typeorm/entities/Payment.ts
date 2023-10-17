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

export const paymentTableName = 'payments'

@Entity(paymentTableName)
class Payment {
  @PrimaryColumn()
  id: string

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

export default Payment
