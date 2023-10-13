import Correction from '../infra/typeorm/entities/Correction'
import CorrectionRepository from '../infra/typeorm/repositories/CorrectionRepository'
import { injectable } from 'tsyringe'
import OpenAiProvider from '@shared/container/providers/AiProvider/implementations/OpenAiProvider'
import EssayRepository from '../infra/typeorm/repositories/EssayRepository'
import EssayStatusEnum from '../enums/EssayStatusEnum'
import FirebaseMessagingProvider from '@shared/container/providers/NotificationProvider/implementations/FirebaseMessagingProvider'
import Essay from '../infra/typeorm/entities/Essay'
import TransactionRepository from '@modules/transactions/infra/typeorm/repositories/TransactionRepository'

interface IRequest {
  essayId: string
  text: string
  theme: string
  token?: string | undefined
  automaticFlag?: boolean | undefined
  isFour: boolean
}

export interface Competencia {
  descricao: string
  nota: number
}

interface ICorrection {
  competencia1: Competencia
  competencia2: Competencia
  competencia3: Competencia
  competencia4: Competencia
  competencia5: Competencia
  pontosFortes: string
  pontosAMelhorar: string
}

@injectable()
class CreateCorrectionJob {
  private async createCorrection(
    prompt: string,
    completion: string,
    essayId: string,
  ) {
    const correctionRepository = new CorrectionRepository()
    const checkCorrectionExists = await correctionRepository.findByEssayId(
      essayId,
    )

    let result: Correction

    if (!checkCorrectionExists) {
      result = await correctionRepository.create({
        prompt,
        completion,
        essayId,
      })
    } else {
      checkCorrectionExists.prompt = prompt
      checkCorrectionExists.completion = completion

      await correctionRepository.save(checkCorrectionExists)

      result = checkCorrectionExists
    }

    return result
  }

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
    text,
    theme,
    token,
    automaticFlag,
    isFour,
  }: IRequest): Promise<Correction> {
    const essayRepository = new EssayRepository()
    const aiProvider = new OpenAiProvider()
    const notificationProvider = new FirebaseMessagingProvider()

    const { prompt, completion } = await aiProvider.correctionEssay({
      text,
      theme,
      isFour,
    })

    const essay = await essayRepository.findById(essayId)

    const obj = JSON.parse(completion)

    if (automaticFlag === true) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const correction: ICorrection = obj

        const result = await this.createCorrection(prompt, completion, essayId)

        essay.status = EssayStatusEnum.COMPLETED

        await essayRepository.save(essay)

        if (token) {
          await notificationProvider.createNotification({
            token,
            title: 'Redação corrigida!',
            content: `A redação sobre o tema "${theme}" foi corrigida`,
          })
        }

        return result
      } catch (error) {
        await this.estornCredits(essay.accountId, essay)

        if (token) {
          await notificationProvider.createNotification({
            token,
            title: 'Erro na correção!',
            content: `Ocorreu um erro na correção, a tentativa foi estornada`,
          })
        }
      }
    }
  }
}

export default {
  key: 'CreateCorrectionJob',
  handle: new CreateCorrectionJob().execute.bind(new CreateCorrectionJob()),
}
