import { app } from './app'
import { createServer } from 'http'

const server = createServer(app).listen(process.env.PORT || 3000, () => {
  console.log('Server is running.')
})

export { app, server }
