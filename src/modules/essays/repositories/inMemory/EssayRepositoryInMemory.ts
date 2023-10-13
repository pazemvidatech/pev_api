import IEssayRepository from '@modules/essays/repositories/IEssayRepository'

import Essay from '../../infra/typeorm/entities/Essay'
import ICreateEssayDTO from '@modules/essays/dtos/ICreateEssayDTO'
import {
  IFindAllEssaysRequestDTO,
  IFindAllEssaysResponseDTO,
} from '@modules/essays/dtos/IFindAllEssaysDTO'

class EssayRepositoryInMemory implements IEssayRepository {
  private essays: Essay[] = []

  public async create(essayData: ICreateEssayDTO): Promise<Essay> {
    const { accountId, text, theme } = essayData
    const essay = new Essay()

    Object.assign(essay, {
      accountId,
      text,
      theme,
      createdAt: new Date(),
    })

    this.essays.push(essay)

    return essay
  }

  public async findById(id: string): Promise<Essay> {
    const essay = this.essays.find(essay => essay.id === id)

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
    const startTomorrow = new Date(today.getTime() + 86400000)
    const essay = this.essays.find(
      essay =>
        essay.accountId === accountId &&
        essay.createdAt >= startOfDay &&
        essay.createdAt < startTomorrow,
    )

    return essay
  }

  public async findAll(
    query: IFindAllEssaysRequestDTO,
  ): Promise<IFindAllEssaysResponseDTO> {
    const orderBy = query.order.createdAt
    const { take, skip } = query

    const start = this.essays

    start.sort((a, b) => {
      const aCA = a.createdAt.getMilliseconds()
      const bCA = b.createdAt.getMilliseconds()
      switch (orderBy) {
        case 'ASC':
          return aCA - bCA
        case 'DESC':
          return bCA - aCA
      }
    })

    const essays = start.slice(skip, skip + take)

    return { data: essays, total: essays.length }
  }

  public async findCount(): Promise<number> {
    const numberEssays = this.essays.length

    return numberEssays
  }

  public async save(essay: Essay): Promise<void> {
    const findIndex = this.essays.findIndex(findEssay => findEssay === essay)

    this.essays[findIndex] = essay
  }

  public async remove(essay: Essay): Promise<void> {
    const findIndex = this.essays.findIndex(
      essayFinded => essayFinded === essay,
    )

    this.essays.splice(findIndex, 1)
  }
}

export default EssayRepositoryInMemory
