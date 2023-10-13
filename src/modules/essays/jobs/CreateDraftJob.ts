import { injectable } from 'tsyringe'
import EssayRepository from '../infra/typeorm/repositories/EssayRepository'
import EssayStatusEnum from '../enums/EssayStatusEnum'
import FirebaseMessagingProvider from '@shared/container/providers/NotificationProvider/implementations/FirebaseMessagingProvider'
import Essay from '../infra/typeorm/entities/Essay'
import TransactionRepository from '@modules/transactions/infra/typeorm/repositories/TransactionRepository'
import A4AProvider from '@shared/container/providers/OcrProvider/implementations/A4AProvider'
import OpenAiProvider from '@shared/container/providers/AiProvider/implementations/OpenAiProvider'

interface IRequest {
  essayId: string
  image: string
  theme: string
  token?: string | undefined
}

@injectable()
class CreateDraftJob {
  private async estornCredits(accountId: string, essay: Essay) {
    const essayRepository = new EssayRepository()
    const transactionRepository = new TransactionRepository()

    if (essay.payCredits) {
      await transactionRepository.create({
        accountId,
        type: 'credit',
        amount: 100,
        description: 'Estorno de correção',
      })
    }

    await essayRepository.remove(essay)
  }

  public async execute({
    essayId,
    image,
    theme,
    token,
  }: IRequest): Promise<Essay> {
    const essayRepository = new EssayRepository()
    const ocrProvider = new A4AProvider()
    const aiProvider = new OpenAiProvider()
    const notificationProvider = new FirebaseMessagingProvider()

    const essay = await essayRepository.findById(essayId)

    try {
      const text = await ocrProvider.convertManuscript(image)

      const correctText = await aiProvider.fixOrthography(text)

      essay.status = EssayStatusEnum.DRAFT
      essay.text = correctText

      await essayRepository.save(essay)

      if (token) {
        await notificationProvider.createNotification({
          token,
          title: 'Pronta para revisão',
          content: `A foto da redação do tema "${theme}" foi convertida e está pronta para revisão`,
        })
      }

      return essay
    } catch (error) {
      await this.estornCredits(essay.accountId, essay)

      if (token) {
        await notificationProvider.createNotification({
          token,
          title: 'Erro na conversão!',
          content: `Ocorreu um erro na conversão, a tentativa foi estornada`,
        })
      }
    }
  }
}

export default {
  key: 'CreateDraftJob',
  handle: new CreateDraftJob().execute.bind(new CreateDraftJob()),
}
