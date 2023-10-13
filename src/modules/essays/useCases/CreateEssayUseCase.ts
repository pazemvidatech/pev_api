import Essay from '../infra/typeorm/entities/Essay'
import IEssayRepository from '../repositories/IEssayRepository'
import { injectable, inject } from 'tsyringe'
import { CreateCorrectionJob } from '../jobs'
import Queue from '@shared/queues/Queue'
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'

interface IRequest {
  accountId: string
  text: string
  theme: string
  isFour: boolean
}

@injectable()
class CreateEssayUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,

    @inject('AccountRepository')
    private accountRepository: IAccountRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute({
    accountId,
    text,
    theme,
    isFour,
  }: IRequest): Promise<Essay> {
    const essay = await this.essayRepository.create({
      accountId,
      text,
      theme,
    })

    await this.cacheProvider.invalidate(`profile:${accountId}`)

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

export default CreateEssayUseCase
