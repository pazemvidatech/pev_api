import ISubscriptionRepository from '../repositories/ISubscriptionRepository'
import { injectable, inject } from 'tsyringe'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { IWebhookPurchaseDTO } from '@modules/accounts/dtos/IWebhookPurchaseDTO'
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository'
import INotificationProvider from '@shared/container/providers/NotificationProvider/models/INotificationProvider'
import Subscription from '../infra/typeorm/entities/Subscription'
import PlatformEnum from '../enums/PlatformEnum'

@injectable()
class SubscriptionWebhookUseCase {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,

    @inject('AccountRepository')
    private accountRepository: IAccountRepository,

    @inject('NotificationProvider')
    private notificationProvider: INotificationProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  private async sendNotification(
    title: string,
    content: string,
    accountId: string,
  ) {
    const token = await this.cacheProvider.recover<string>(`token:${accountId}`)

    if (token) {
      await this.notificationProvider.createNotification({
        title,
        content,
        token,
      })
    }
  }

  private async cancelSubscription(subscription: Subscription) {
    await this.subscriptionRepository.remove(subscription)

    await this.sendNotification(
      'Assinatura cancelada',
      'Sua assinatura do Citaí Premium foi cancelada com sucesso',
      subscription.accountId,
    )
  }

  private async createSubscription({
    accountId,
    platform,
    externalId,
    productId,
  }: IWebhookPurchaseDTO) {
    await this.subscriptionRepository.create({
      name: productId,
      accountId,
      platform: platform as PlatformEnum,
      externalId,
    })

    await this.sendNotification(
      'Assinatura concluída',
      'Sua assinatura do Citaí Premium foi concluída com sucesso',
      accountId,
    )
  }

  public async execute({
    accountId,
    status,
    externalId,
    platform,
    productId,
  }: IWebhookPurchaseDTO): Promise<void> {
    const subscription = await this.subscriptionRepository.findByAccountId(
      accountId,
    )
    if (status === 'EXPIRATION') {
      if (subscription) await this.cancelSubscription(subscription)
    } else {
      if (!subscription)
        await this.createSubscription({
          accountId,
          platform: platform as PlatformEnum,
          status,
          externalId,
          productId,
        })
    }

    await this.cacheProvider.invalidate(`profile:${accountId}`)
  }
}

export default SubscriptionWebhookUseCase
