export interface Student {
  id: string
  name: string
  email: string
  fees_paid: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface Transaction {
  id: string
  student_id: string
  amount: number
  payment_method: string
  card_last_four: string
  status: 'pending' | 'completed' | 'failed'
  transaction_id: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      students: {
        Row: Student
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
