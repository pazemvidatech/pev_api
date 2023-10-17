import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import Customer from './Customer'

export const dependentTableName = 'dependents'

@Entity(dependentTableName)
class Dependent {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  customerId: string

  @Exclude()
  @ManyToOne(() => Customer, customer => customer.dependents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer

  @Column()
  name: string

  @Column({ nullable: true })
  deathDate?: Date | undefined

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

export default Dependent
