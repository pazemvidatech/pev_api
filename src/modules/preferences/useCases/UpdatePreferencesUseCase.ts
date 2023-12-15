import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'
import { injectable, inject } from 'tsyringe'
import { IPreferenceDTO } from '../dtos/IPreferenceDTO'

@injectable()
class UpdatePreferencesUseCase {
  constructor(
    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute(listPreferences: IPreferenceDTO[]): Promise<any> {
    const result = await this.featureFlagProvider.updatePreferences(
      listPreferences,
    )

    return result
  }
}

export default UpdatePreferencesUseCase
