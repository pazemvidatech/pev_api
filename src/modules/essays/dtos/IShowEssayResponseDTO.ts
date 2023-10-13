import EssayStatusEnum from '../enums/EssayStatusEnum'

export default interface IShowEssayResponseDTO {
  id: string
  correction?: string | undefined
  status: EssayStatusEnum
  theme: string
  text: string
  createdAt: Date
  updatedAt: Date
}
