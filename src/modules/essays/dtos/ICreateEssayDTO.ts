import EssayStatusEnum from '../enums/EssayStatusEnum'

export default interface ICreateEssayDTO {
  accountId: string
  theme: string
  text: string
  status?: EssayStatusEnum | undefined
}
