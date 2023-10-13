import { Express } from 'express'
import * as Tracing from '@sentry/tracing'
import * as Sentry from '@sentry/node'

class SentryFactory {
  public init(app: Express): void {
    if (process.env.NODE_ENV !== 'test') {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
      })

      app.use(Sentry.Handlers.requestHandler())

      app.use(Sentry.Handlers.tracingHandler())
    }
  }

  public error(app: Express): void {
    if (process.env.NODE_ENV !== 'test') {
      app.use(Sentry.Handlers.errorHandler())
    }
  }
}

export default new SentryFactory()
