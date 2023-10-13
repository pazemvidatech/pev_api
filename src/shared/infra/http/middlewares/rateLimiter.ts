import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from 'ioredis'
import cacheConfig from '@config/cache'

import AppError from '@shared/errors/AppError'

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    const redisClient = new Redis(cacheConfig.production)

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rateLimiter',
      points: 5,
      duration: 2,
    })
    try {
      await limiter.consume(request.ip)

      return next()
    } catch (err) {
      throw new AppError(err, 429)
    }
  }

  return next()
}
