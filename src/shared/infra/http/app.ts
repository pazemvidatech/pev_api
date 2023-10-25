import 'reflect-metadata'
import 'dotenv/config'
import express, { json, Response, Request, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import routes from '@shared/infra/http/routes'
import AppError from '@shared/errors/AppError'
import { errors } from 'celebrate'
import '@shared/infra/typeorm'
import { rateLimiterMiddleware } from './middlewares/rateLimiterTest'
import Sentry from './factories/sentryFactory'
import '@shared/container'

const app = express()
app.use(cors())

// middlewares
app.use(rateLimiterMiddleware)
app.use(json())

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )

  req.next()
})

// Sentry
Sentry.init(app)

// routes
app.use('/v1', routes)

app.options('*', cors())

app.use(errors({ statusCode: 422 }))

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
  })
})

Sentry.error(app)

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })

  return res.status(500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : `Internal server error - ${err}`,
  })
})

export { app }
