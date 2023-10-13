import { container } from 'tsyringe'

import IFeatureFlagProvider from './models/IFeatureFlagProvider'
import RemoteConfigProvider from './implementations/RemoteConfigProvider'

container.registerSingleton<IFeatureFlagProvider>(
  'FeatureFlagProvider',
  RemoteConfigProvider,
)
