import { container } from 'tsyringe'

import IAiProvider from './models/IAiProvider'
import OpenAiProvider from './implementations/OpenAiProvider'

container.registerSingleton<IAiProvider>('AiProvider', OpenAiProvider)
