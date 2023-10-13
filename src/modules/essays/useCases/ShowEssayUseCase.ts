import IEssayRepository from '../repositories/IEssayRepository'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import Essay from '../infra/typeorm/entities/Essay'

@injectable()
class ShowEssayUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,
  ) {}

  public async execute(id: string, accountId: string): Promise<Essay> {
    const essay = await this.essayRepository.findByIdRelations(id)

    if (!essay) throw new AppError('Essay not found', 404)

    if (essay.accountId !== accountId)
      throw new AppError('Essay not found', 404)

    return essay
  }
}

export default ShowEssayUseCase
