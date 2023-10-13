import { Router } from 'express'
import SubscriptionWebhookController from '../controllers/SubscriptionWebhookController'

const subscriptionWebhooksRoutes = Router()
const subscriptionWebhookController = new SubscriptionWebhookController()

subscriptionWebhooksRoutes.post(
  '/payment',
  subscriptionWebhookController.handle,
)

export default subscriptionWebhooksRoutes
