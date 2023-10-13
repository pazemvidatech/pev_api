import { container } from 'tsyringe'

import RedisCacheProvider from './implementations/RedisCacheProvider'

import ICacheProvider from './models/ICacheProvider'

const providers = {
  development: RedisCacheProvider,
  test: RedisCacheProvider,
  local: RedisCacheProvider,
  production: RedisCacheProvider,
}

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  providers[process.env.NODE_ENV],
)
