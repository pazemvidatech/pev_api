import ITransactionRepository from '../repositories/ITransactionRepository'
import { injectable, inject } from 'tsyringe'
import IPaymentProvider from '@shared/container/providers/PaymentProvider/models/IPaymentProvider'
import { PaymentStatusEnum } from '@shared/container/providers/PaymentProvider/models/enums/PaymentStatusEnum'
import IMetadataDTO from '@shared/container/providers/PaymentProvider/dtos/IMetadataDTO'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import INotificationProvider from '@shared/container/providers/NotificationProvider/models/INotificationProvider'

@injectable()
class TransactionWebhookUseCase {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,

    @inject('PaymentProvider')
    private paymentProvider: IPaymentProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('NotificationProvider')
    private notificationProvider: INotificationProvider,
  ) {}

  private async createTransaction(metadata: IMetadataDTO, externalId: string) {
    const amount = metadata.package.amount

    await this.transactionRepository.create({
      description: 'Compra de citacashs',
      accountId: metadata.account_id,
      type: 'credit',
      amount,
      externalId,
    })

    const token = await this.cacheProvider.recover<string>(
      `token:${metadata.account_id}`,
    )

    if (token) {
      const amount = metadata.package.amount
      await this.notificationProvider.createNotification({
        token,
        title: 'Compra de citacashs',
        content: `Foram depositados em sua conta ${amount} citacashs`,
      })
    }
  }

  private async deleteTransaction(metadata: IMetadataDTO, externalId: string) {
    const amount = metadata.package.amount

    await this.transactionRepository.create({
      description: 'Estorno de citacashs',
      accountId: metadata.account_id,
      type: 'debit',
      amount,
      externalId,
    })

    const token = await this.cacheProvider.recover<string>(
      `token:${metadata.account_id}`,
    )

    if (token) {
      const amount = metadata.package.amount
      await this.notificationProvider.createNotification({
        token,
        title: 'Estorno de citacashs',
        content: `Foram estornados de sua conta ${amount} citacashs`,
      })
    }
  }

  public async execute(paymentId: number): Promise<void> {
    const { metadata, status } = await this.paymentProvider.getPayment(
      paymentId,
    )

    const transaction = await this.transactionRepository.findByExternalId(
      paymentId.toString(),
    )

    if (
      status === PaymentStatusEnum.authorized ||
      status === PaymentStatusEnum.approved
    ) {
      if (!transaction)
        await this.createTransaction(metadata, paymentId.toString())
    } else {
      if (transaction)
        await this.deleteTransaction(metadata, paymentId.toString())
    }

    await this.cacheProvider.invalidate(`profile:${metadata.account_id}`)
  }
}

export default TransactionWebhookUseCase
