import PlatformEnum from '../enums/PlatformEnum'

export default interface ICreateSubscriptionDTO {
  name: string
  accountId: string
  externalId: string
  platform: PlatformEnum
}
