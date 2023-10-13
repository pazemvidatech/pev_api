import 'dotenv/config'
import redisUrl from 'redis-url'

export default {
  development: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password,
    tls: {
      rejectUnauthorized: false,
    },
  },
  test: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password,
  },
  local: {
    host: process.env.CACHE_HOST,
    port: process.env.CACHE_PORT,
  },
  production: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password,
    tls: {
      rejectUnauthorized: false,
    },
  },
}

function parseRedisURL(
  redisURL: string,
): { host: string; port: number; password?: string } {
  const redisConfig = redisUrl.parse(redisURL)

  const host = redisConfig.hostname || ''
  const port = redisConfig.port || 6379
  const password = redisConfig.password
    ? decodeURIComponent(redisConfig.password)
    : undefined

  return { host, port, password }
}
