import { ICreateDependentDTO } from '@modules/customers/dtos/ICreateDependentDTO'
import IDependentRepository from '@modules/customers/repositories/IDependentRepository'
import { Repository } from 'typeorm'
import Datasource from '@shared/infra/typeorm'

import Dependent from '../entities/Dependent'

class DependentRepository implements IDependentRepository {
  private ormRepository: Repository<Dependent>
  constructor() {
    this.ormRepository = Datasource.getRepository(Dependent)
  }

  async create(dependentData: ICreateDependentDTO): Promise<Dependent> {
    const dependent = this.ormRepository.create(dependentData)

    return await this.ormRepository.save(dependent)
  }

  async findById(id: string): Promise<Dependent | undefined> {
    const dependent = await this.ormRepository.findOneBy({ id })

    return dependent
  }

  async remove(dependent: Dependent): Promise<Dependent> {
    return await this.ormRepository.remove(dependent)
  }

  async save(dependent: Dependent): Promise<Dependent> {
    return await this.ormRepository.save(dependent)
  }
}

export default DependentRepository
