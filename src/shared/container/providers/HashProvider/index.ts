import { container } from 'tsyringe'

import IHashProvider from './models/IHashProvider'
import HashProvider from './implementations/BCryptHashProvider'

container.registerSingleton<IHashProvider>('HashProvider', HashProvider)
