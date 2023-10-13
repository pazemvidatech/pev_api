import IEssayRepository from '../repositories/IEssayRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'

@injectable()
class DeleteEssayUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const essay = await this.essayRepository.findById(id)

    if (!essay) throw new AppError('This essay does not exists')

    await this.essayRepository.remove(essay)
  }
}

export default DeleteEssayUseCase
