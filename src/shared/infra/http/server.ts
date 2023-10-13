import { app } from './app'
import { createServer } from 'http'

const server = createServer(app).listen(3000)

export { app, server }
