import { ICreateDependentDTO } from '../dtos/ICreateDependentDTO'
import Dependent from '../infra/typeorm/entities/Dependent'

export default interface IDependentRepository {
  create(customerData: ICreateDependentDTO): Promise<Dependent>
  findById(customerId: string): Promise<Dependent | undefined>
  remove(customer: Dependent): Promise<Dependent>
  save(customer: Dependent): Promise<Dependent>
}
