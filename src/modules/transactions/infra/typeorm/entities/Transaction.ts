import { Exclude } from 'class-transformer'
import Account from '../../../../accounts/infra/typeorm/entities/Account'
import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'

import { v4 as uuidV4 } from 'uuid'

export const transactionTableName = 'transactions'

@Entity(transactionTableName)
class Transaction {
  @PrimaryColumn()
  id: string

  @Column()
  description: string

  @Exclude()
  @Column()
  accountId: string

  @ManyToOne(() => Account, account => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account

  @Exclude()
  @Column({ nullable: true })
  externalId?: string

  @Column()
  amount: number

  @Column()
  type: 'credit' | 'debit'

  @CreateDateColumn()
  createdAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export default Transaction
