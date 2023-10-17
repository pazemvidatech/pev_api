import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import Dependent from './Dependent'
import { Expose } from 'class-transformer'
import Payment from '../../../../payments/infra/typeorm/entities/Payment'

export const customerTableName = 'customers'

@Entity(customerTableName)
class Customer {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  code: string

  @Column({ default: false })
  silverPlan: boolean

  @Column()
  numberId: string

  @Column()
  address: string | undefined

  @Column({ nullable: true })
  email?: string | undefined

  @Column({ nullable: true })
  document?: string | undefined

  @Column()
  payday: number

  @OneToMany(() => Dependent, dependent => dependent.customer, {
    eager: true,
    cascade: true,
  })
  dependents: Dependent[]

  @OneToMany(() => Payment, payment => payment.customer)
  payments: Payment[]

  @Expose({ name: 'numberDependents' })
  numberDependents(): number {
    return this.dependents.length
  }

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

export default Customer