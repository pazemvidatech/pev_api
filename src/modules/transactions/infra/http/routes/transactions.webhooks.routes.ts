import { Router } from 'express'
import TransactionWebhookController from '../controllers/TransactionWebhookController'

const transactionWebhooksRoutes = Router()
const transactionWebhookController = new TransactionWebhookController()

transactionWebhooksRoutes.post('/payment', transactionWebhookController.handle)

export default transactionWebhooksRoutes
