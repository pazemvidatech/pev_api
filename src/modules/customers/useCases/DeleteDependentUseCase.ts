import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IDependentRepository from '../repositories/IDependentRepository'

@injectable()
class DeleteDependentUseCase {
  constructor(
    @inject('DependentRepository')
    private dependentRepository: IDependentRepository,
  ) {}

  async execute(dependentId: string): Promise<void> {
    const dependent = await this.dependentRepository.findById(dependentId)

    if (!dependent) throw new AppError('Dependent not found', 404)

    await this.dependentRepository.remove(dependent)
  }
}

export default DeleteDependentUseCase
