import { ICreateFeatureFlagDTO } from '../dtos/ICreateFeatureFlagDTO'

export default interface IFeatureFlagProvider {
  setConfig(data: ICreateFeatureFlagDTO): Promise<void>
  getConfig(key: string): Promise<any>
}
