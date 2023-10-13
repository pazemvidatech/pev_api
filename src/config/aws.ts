import 'dotenv/config'

export default {
  user_pool_id: process.env.COGNITO_USER_POOL_ID,
  client_id: process.env.COGNITO_CLIENT_ID,
  region: process.env.COGNITO_REGION,
  queueUrl: process.env.SQS_QUEUE_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}
