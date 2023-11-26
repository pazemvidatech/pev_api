import Customer from '../../../../customers/infra/typeorm/entities/Customer'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

export const cityTableName = 'cities'

@Entity(cityTableName)
class City {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany(() => Customer, customer => customer.city)
  customers: Customer[]

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

export default City
