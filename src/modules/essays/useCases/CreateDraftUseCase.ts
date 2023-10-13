import IEssayRepository from '../repositories/IEssayRepository'
import { injectable, inject } from 'tsyringe'
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import verifyCreditAccount from '@modules/accounts/utils/VerifyCreditAccount'
import EssayStatusEnum from '../enums/EssayStatusEnum'
import Queue from '@shared/queues/Queue'
import CreateDraftJob from '../jobs/CreateDraftJob'

interface IRequest {
  accountId: string
  image: string
  theme: string
}

@injectable()
class CreateDraftUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,

    @inject('AccountRepository')
    private accountRepository: IAccountRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ accountId, image, theme }: IRequest): Promise<void> {
    const account = await this.accountRepository.findById(accountId)
    const essayToday = await this.essayRepository.findByAccountIdAndToday(
      accountId,
    )

    verifyCreditAccount({ account, essayToday })

    const essay = await this.essayRepository.create({
      accountId,
      text: '',
      theme,
      status: EssayStatusEnum.CONVERTING,
    })

    await this.cacheProvider.invalidate(`profile:${accountId}`)

    const token = await this.cacheProvider.recover<string>(`token:${accountId}`)

    await Queue.add(CreateDraftJob.key, {
      image,
      theme,
      essayId: essay.id,
      token,
    })
  }
}

export default CreateDraftUseCase
