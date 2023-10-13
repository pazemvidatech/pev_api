import PlatformEnum from '../../../../subscriptions/enums/PlatformEnum'
import Account from '../../../../accounts/infra/typeorm/entities/Account'
import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'

import { v4 as uuidV4 } from 'uuid'

export const subscriptionTableName = 'subscriptions'

@Entity(subscriptionTableName)
class Subscription {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  accountId: string

  @OneToOne(() => Account, account => account.subscription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account

  @Column()
  externalId: string

  @Column('text')
  platform: PlatformEnum

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

export default Subscription
