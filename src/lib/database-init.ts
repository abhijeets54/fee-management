// Database initialization utility
// This can be used to check and create tables if they don't exist

import { createClient } from './supabase/client'

export async function initializeDatabase() {
  const supabase = createClient()
  
  try {
    // Check if students table exists by trying to query it
    const { error: studentsError } = await supabase
      .from('students')
      .select('id')
      .limit(1)

    if (studentsError) {
      console.error('Students table not found or accessible:', studentsError)
      return {
        success: false,
        error: 'Database tables not found. Please run the SQL schema in your Supabase dashboard.',
        details: studentsError
      }
    }

    // Check if transactions table exists
    const { error: transactionsError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1)

    if (transactionsError) {
      console.error('Transactions table not found or accessible:', transactionsError)
      return {
        success: false,
        error: 'Transactions table not found. Please run the SQL schema in your Supabase dashboard.',
        details: transactionsError
      }
    }

    return {
      success: true,
      message: 'Database tables are accessible'
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    return {
      success: false,
      error: 'Failed to connect to database',
      details: error
    }
  }
}

export async function createStudentRecord(userId: string, name: string, email: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('students')
      .insert({
        user_id: userId,
        name,
        email,
        fees_paid: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating student record:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error creating student record:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

export async function checkUserHasStudentRecord(userId: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // No record found
      return { exists: false, data: null }
    }

    if (error) {
      console.error('Error checking student record:', error)
      return { exists: false, error: error.message }
    }

    return { exists: true, data }
  } catch (error) {
    console.error('Unexpected error checking student record:', error)
    return { exists: false, error: 'Unexpected error occurred' }
  }
}
