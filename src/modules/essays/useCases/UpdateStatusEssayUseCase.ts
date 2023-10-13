import IEssayRepository from '../repositories/IEssayRepository'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IUpdateStatusEssayDTO from '../dtos/IUpdateStatusEssayDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import INotificationProvider from '@shared/container/providers/NotificationProvider/models/INotificationProvider'

@injectable()
class UpdateStatusEssayUseCase {
  constructor(
    @inject('EssayRepository')
    private essayRepository: IEssayRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('NotificationProvider')
    private notificationProvider: INotificationProvider,
  ) {}

  public async execute({
    newStatus,
    id,
  }: IUpdateStatusEssayDTO): Promise<void> {
    const essay = await this.essayRepository.findById(id)

    if (!essay) throw new AppError('This essay does not exists')

    essay.status = newStatus

    await this.essayRepository.save(essay)

    const token = await this.cacheProvider.recover<string>(
      `token:${essay.accountId}`,
    )

    if (token) {
      const theme = essay.theme
      await this.notificationProvider.createNotification({
        token,
        title: 'Redação respondida!',
        content: `A sua redação do tema "${theme}" foi respondida`,
      })
    }
  }
}

export default UpdateStatusEssayUseCase
