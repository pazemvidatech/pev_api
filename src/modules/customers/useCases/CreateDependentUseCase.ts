import { inject, injectable } from 'tsyringe'

import IDependentRepository from '../repositories/IDependentRepository'

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

  async execute({ name, customerId, deathDate }: IRequest): Promise<void> {
    await this.dependentRepository.create({
      name,
      customerId,
      deathDate,
    })
  }
}

export default CreateDependentUseCase