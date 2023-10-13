declare namespace Express {
  export interface Request {
    account: {
      id: string
      email: string
      name: string
      role: number
      username: string
    }
    accessToken
    io
    connectedCustomers
    connectedPlans
  }
}
