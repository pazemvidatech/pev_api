import IFeatureFlagProvider from '@shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider'
import { injectable, inject } from 'tsyringe'

@injectable()
class FindAllPreferencesUseCase {
  constructor(
    @inject('FeatureFlagProvider')
    private featureFlagProvider: IFeatureFlagProvider,
  ) {}

  public async execute(): Promise<any> {
    const result = await this.featureFlagProvider.getAllPreferences()

    return result
  }
}

export default FindAllPreferencesUseCase
