import { NextFunction, Request, Response } from 'express'
import {
  IRateLimiterRedisOptions,
  RateLimiterRedis,
} from 'rate-limiter-flexible'
import cacheConfig from '@config/cache'

import Redis from 'ioredis'
const redisClient = new Redis(cacheConfig[process.env.NODE_ENV])

redisClient.on('error', err => {
  console.log(err)
  redisClient.disconnect()
  redisClient.connect()
})

const MAX_REQUEST_LIMIT = 100
const MAX_REQUEST_WINDOW = 60
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests'

const options: IRateLimiterRedisOptions = {
  duration: MAX_REQUEST_WINDOW,
  points: MAX_REQUEST_LIMIT,
  storeClient: redisClient,
}

const rateLimiter = new RateLimiterRedis(options)

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  rateLimiter
    .consume(req.ip)
    .then(rateLimiterRes => {
      res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000)
      res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT)
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints)
      res.setHeader(
        'X-RateLimit-Reset',
        new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
      )
      next()
    })
    .catch(() => {
      res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE })
    })
}
