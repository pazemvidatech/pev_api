import EssayStatusEnum from '../enums/EssayStatusEnum'

export default interface IUpdateStatusEssayDTO {
  id: string
  newStatus: EssayStatusEnum
}
