import Correction from '../infra/typeorm/entities/Correction'
import ICorrectionRepository from '../repositories/ICorrectionRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import IEssayRepository from '../repositories/IEssayRepository'
import CreateCorrectionJob from '../jobs/CreateCorrectionJob'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

@injectable()
class CreateCorrectionUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,

    @inject('CorrectionRepository')
    private correctionRepository: ICorrectionRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(essayId: string): Promise<Correction> {
    const essay = await this.essayRepository.findById(essayId)

    if (!essay) throw new AppError('Essay not found', 404)

    const token = await this.cacheProvider.recover<string>(
      `token:${essay.accountId}`,
    )

    const job = CreateCorrectionJob.handle
    const { prompt, completion } = await job({
      essayId,
      text: essay.text,
      theme: essay.theme,
      token,
    })

    let correction: Correction

    const correctionExists = await this.correctionRepository.findByEssayId(
      essayId,
    )

    if (correctionExists) {
      correctionExists.completion = completion
      correctionExists.prompt = prompt

      await this.correctionRepository.save(correctionExists)

      correction = correctionExists
    } else {
      correction = await this.correctionRepository.create({
        essayId,
        prompt,
        completion,
      })
    }

    return correction
  }
}

export default CreateCorrectionUseCase
