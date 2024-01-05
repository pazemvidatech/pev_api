import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import Dependent from './Dependent'
import { Expose } from 'class-transformer'
import Payment from '../../../../payments/infra/typeorm/entities/Payment'
import City from '../../../../cities/infra/typeorm/entities/City'
import Renegotiation from '../../../../payments/infra/typeorm/entities/Renegotiation'

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

  @Column({ default: 3 })
  frequency: number

  @Column()
  numberId: string

  @Column()
  address: string | undefined

  @Column({ nullable: true })
  email?: string | undefined

  @Column({ nullable: true })
  document?: string | undefined

  @Column({ nullable: true })
  phone?: string | undefined

  @Column({ default: false })
  oldRegister: boolean

  @Column()
  payday: number

  @OneToMany(() => Dependent, dependent => dependent.customer, {
    eager: true,
    cascade: true,
  })
  dependents: Dependent[]

  @OneToMany(() => Payment, payment => payment.customer, {
    cascade: true,
  })
  payments: Payment[]

  @OneToMany(() => Renegotiation, renegotiation => renegotiation.customer, {
    cascade: true,
  })
  renegotiations: Renegotiation[]

  @Column({ nullable: true })
  cityId?: string | undefined

  @ManyToOne(() => City, city => city.customers, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cityId' })
  city: City

  @Expose({ name: 'numberDependents' })
  numberDependents(): number {
    if (this.dependents != null) {
      return this.dependents.length
    }
  }

  @Expose({ name: 'paymentCount' })
  paymentCount(): number {
    return 0
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
