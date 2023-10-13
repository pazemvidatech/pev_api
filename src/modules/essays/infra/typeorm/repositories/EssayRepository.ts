import { DataSource, FindManyOptions, Repository } from 'typeorm'

import Datasource from '@shared/infra/typeorm'
import IEssayRepository from '@modules/essays/repositories/IEssayRepository'

import Essay from '../entities/Essay'
import ICreateEssayDTO from '@modules/essays/dtos/ICreateEssayDTO'
import { IFindAllEssaysResponseDTO } from '@modules/essays/dtos/IFindAllEssaysDTO'
import Account from '@modules/accounts/infra/typeorm/entities/Account'
import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction'
import AppError from '@shared/errors/AppError'

class EssayRepository implements IEssayRepository {
  private ormRepository: Repository<Essay>
  private connection: DataSource

  constructor() {
    this.connection = Datasource
    this.ormRepository = Datasource.getRepository(Essay)
  }

  public async create(essayData: ICreateEssayDTO): Promise<Essay> {
    return await this.connection.transaction(async entityManager => {
      let payCredits = false

      const account = await entityManager.findOneBy(Account, {
        id: essayData.accountId,
      })

      if (!account.subscription) {
        if (account.credits > 99) {
          const trans = new Transaction()
          trans.accountId = essayData.accountId
          trans.amount = 100
          trans.description = 'Correção de redação'
          trans.type = 'debit'
          await entityManager.save(trans)

          account.credits = account.credits - 100
          await entityManager.save(account)

          payCredits = true
        } else {
          throw new AppError('Dont have sufficient credits', 403)
        }
      } else {
        const today = new Date()
        const startOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        )

        const essayToday = await entityManager
          .createQueryBuilder(Essay, 'essay')
          .where('essay.accountId = :accountId', {
            accountId: essayData.accountId,
          })
          .andWhere('essay.createdAt >= :startOfDay', { startOfDay })
          .andWhere('essay.createdAt < :tomorrow', {
            tomorrow: new Date(today.getTime() + 86400000),
          })
          .getOne()

        if (essayToday) {
          if (account.credits > 99) {
            const trans = new Transaction()
            trans.accountId = essayData.accountId
            trans.amount = 100
            trans.description = 'Correção de redação'
            trans.type = 'debit'
            await entityManager.save(trans)

            account.credits = account.credits - 100
            await entityManager.save(account)

            payCredits = true
          } else {
            throw new AppError(
              'Essay sended today and you dont have sufficient credits',
              409,
            )
          }
        }
      }

      const essay = new Essay()
      essay.accountId = essayData.accountId
      essay.text = essayData.text
      essay.theme = essayData.theme
      essay.payCredits = payCredits
      if (essayData.status) essay.status = essayData.status

      await entityManager.save(essay)

      return essay
    })
  }

  public async findById(id: string): Promise<Essay | undefined> {
    const essay = await this.ormRepository.findOne({ where: { id } })

    return essay
  }

  public async findByIdRelations(id: string): Promise<Essay | undefined> {
    const essay = await this.ormRepository.findOne({
      where: { id },
      relations: { correction: true },
    })

    return essay
  }

  public async findByAccountIdAndToday(
    accountId: string,
  ): Promise<Essay | undefined> {
    const today = new Date()
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )

    const essay = await this.ormRepository
      .createQueryBuilder('essay')
      .where('essay.accountId = :accountId', { accountId })
      .andWhere('essay.createdAt >= :startOfDay', { startOfDay })
      .andWhere('essay.createdAt < :tomorrow', {
        tomorrow: new Date(today.getTime() + 86400000),
      })
      .getOne()

    return essay
  }

  public async findAll(
    query: FindManyOptions<Essay>,
  ): Promise<IFindAllEssaysResponseDTO> {
    const result = await this.ormRepository.findAndCount(query)

    return { data: result[0], total: result[1] }
  }

  public async save(essay: Essay): Promise<void> {
    await this.ormRepository.save(essay)
  }

  public async remove(essay: Essay): Promise<void> {
    await this.ormRepository.remove(essay)
  }
}

export default EssayRepository
