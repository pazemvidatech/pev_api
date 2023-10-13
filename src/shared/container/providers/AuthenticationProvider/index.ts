import { container } from 'tsyringe'

import IAuthenticationProvider from './models/IAuthenticationProvider'
import CognitoProvider from './implementations/CognitoProvider'

container.registerSingleton<IAuthenticationProvider>(
  'AuthenticationProvider',
  CognitoProvider,
)
