import { inject, injectable } from 'tsyringe'

import IDependentRepository from '../repositories/IDependentRepository'
import Dependent from '../infra/typeorm/entities/Dependent'

interface IRequest {
  customerId: string
  name: string
  deathDate?: Date | undefined
}

@injectable()
class CreateDependentUseCase {
  constructor(
    @inject('DependentRepository')
    private dependentRepository: IDependentRepository,
  ) {}

  async execute({ name, customerId, deathDate }: IRequest): Promise<Dependent> {
    const dependetCreated = await this.dependentRepository.create({
      name,
      customerId,
      deathDate,
    })
    return dependetCreated
  }
}

export default CreateDependentUseCase
