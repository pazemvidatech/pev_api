import { container } from 'tsyringe'

import IDateProvider from './models/IDateProvider'
import DayjsDateProvider from './implementations/DayjsDateProvider'

container.registerSingleton<IDateProvider>('DateProvider', DayjsDateProvider)
