export type Transaction = {
  id: string
  amount: number
  transactionStatus: string
  transactionType: 'deposit' | 'withdrawal'
  userId: string
  createdAt: string
  updatedAt: string
}
