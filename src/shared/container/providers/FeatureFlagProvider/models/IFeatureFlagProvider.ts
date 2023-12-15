import { IPreferenceDTO } from '@modules/preferences/dtos/IPreferenceDTO'
import { ICreateFeatureFlagDTO } from '../dtos/ICreateFeatureFlagDTO'

export default interface IFeatureFlagProvider {
  setConfig(data: ICreateFeatureFlagDTO): Promise<void>
  getConfig(key: string): Promise<any>
  getPreference(key: string): Promise<any>
  getAllPreferences(): Promise<IPreferenceDTO[]>
  updatePreferences(data: IPreferenceDTO[]): Promise<IPreferenceDTO[]>
}
