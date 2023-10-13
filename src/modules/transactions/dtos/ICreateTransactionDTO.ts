export default interface ICreateTransactionDTO {
  description: string
  accountId: string
  externalId?: string
  amount: number
  type: 'credit' | 'debit'
}
