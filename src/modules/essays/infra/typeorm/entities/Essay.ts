import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm'

import Account from '../../../../accounts/infra/typeorm/entities/Account'
import EssayStatusEnum from '../../../enums/EssayStatusEnum'
import { v4 as uuidV4 } from 'uuid'
import Correction from './Correction'
import { Exclude } from 'class-transformer'

export const essayTableName = 'essays'

@Entity(essayTableName)
class Essay {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  accountId: string

  @Exclude()
  @ManyToOne(() => Account, account => account.essays, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account

  @Exclude()
  @OneToOne(() => Correction, correction => correction.essay, {
    cascade: true,
  })
  correction: Correction

  @Column('text', { default: EssayStatusEnum.PENDING })
  status: EssayStatusEnum

  @Column('varchar')
  theme: string

  @Column('boolean', { default: false })
  payCredits: boolean

  @Exclude()
  @Column('text')
  text: string

  @UpdateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export default Essay
