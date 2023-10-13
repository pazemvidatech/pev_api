import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm'

import { v4 as uuidV4 } from 'uuid'
import Essay from './Essay'

export const essayTableName = 'corrections'

@Entity(essayTableName)
class Correction {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  essayId: string

  @OneToOne(() => Essay, essay => essay.correction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'essayId' })
  essay: Essay

  @Column('text')
  prompt: string

  @Column('text')
  completion: string

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

export default Correction
