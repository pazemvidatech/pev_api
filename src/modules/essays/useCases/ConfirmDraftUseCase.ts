import Essay from '../infra/typeorm/entities/Essay'
import IEssayRepository from '../repositories/IEssayRepository'
import { injectable, inject } from 'tsyringe'
import { CreateCorrectionJob } from '../jobs'
import Queue from '@shared/queues/Queue'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'
import AppError from '@shared/errors/AppError'
import EssayStatusEnum from '../enums/EssayStatusEnum'

interface IRequest {
  essayId: string
  accountId: string
  text: string
  theme: string
  isFour: boolean
}

@injectable()
class ConfirmDraftUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute({
    accountId,
    text,
    theme,
    essayId,
    isFour,
  }: IRequest): Promise<Essay> {
    const essay = await this.essayRepository.findById(essayId)

    if (!essay) throw new AppError('Essay not found', 404)

    if (essay.accountId !== accountId)
      throw new AppError('Essay not found', 404)

    essay.text = text
    essay.theme = theme
    essay.status = EssayStatusEnum.PENDING

    await this.essayRepository.save(essay)

    const token = await this.cacheProvider.recover<string>(`token:${accountId}`)
    const automaticFlag = await this.featureFlagProvider.getConfig(
      'automaticCorrection',
    )

    await Queue.add(CreateCorrectionJob.key, {
      text,
      theme,
      essayId: essay.id,
      token,
      automaticFlag,
      isFour,
    })

    return essay
  }
}

export default ConfirmDraftUseCase
