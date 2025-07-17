'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, CheckCircle, XCircle, Edit, Save, X, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Student, Transaction } from '@/types/database'
import Link from 'next/link'

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })

  const router = useRouter()
  const supabase = createClient()

  const fetchStudentProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // First try to get existing student record
      const { data: existingStudents, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)

      if (fetchError) {
        console.error('Error fetching student profile:', fetchError)
        setError('Failed to load profile')
        return
      }

      // If student record exists, use it
      if (existingStudents && existingStudents.length > 0) {
        const studentData = existingStudents[0]
        setStudent(studentData)
        setEditForm({
          name: studentData.name,
          email: studentData.email
        })
        await fetchTransactions(studentData.id)
      } else {
        // No student record exists, create one
        console.log('No student record found, creating one...')

        const { data: newStudent, error: createError } = await supabase
          .from('students')
          .insert({
            user_id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            fees_paid: false,
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating student record:', createError)
          setError('Failed to create profile. Please contact support.')
        } else {
          setStudent(newStudent)
          setEditForm({
            name: newStudent.name,
            email: newStudent.email
          })
          await fetchTransactions(newStudent.id)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
      } else {
        setTransactions(data || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  useEffect(() => {
    fetchStudentProfile()
  }, [])

  useEffect(() => {
    // Set up real-time subscription for the current student
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const channel = supabase
        .channel('student-profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'students',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Profile real-time update:', payload)
            setStudent(payload.new as Student)
            setEditForm({
              name: payload.new.name,
              email: payload.new.email
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    const cleanup = setupRealtimeSubscription()

    return () => {
      cleanup.then(fn => fn && fn())
    }
  }, [supabase])

  const handleEdit = () => {
    setEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setEditing(false)
    setEditForm({
      name: student?.name || '',
      email: student?.email || ''
    })
    setError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (!student) return

      const { error } = await supabase
        .from('students')
        .update({
          name: editForm.name,
          email: editForm.email
        })
        .eq('id', student.id)

      if (error) {
        setError('Failed to update profile')
      } else {
        setStudent({
          ...student,
          name: editForm.name,
          email: editForm.email
        })
        setEditing(false)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
            <Button onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Profile
              </h1>
              <p className="text-gray-600">
                Manage your account details and fee payment status
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  {!editing && (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {editing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{student.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {editing ? (
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email"
                        type="email"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{student.email}</p>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-1"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Fee Payment Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Fee Payment Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    {student.fees_paid ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">Paid</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-red-600" />
                        <span className="text-2xl font-bold text-red-600">Unpaid</span>
                      </>
                    )}
                  </div>

                  <p className="text-gray-600">
                    {student.fees_paid
                      ? 'Your fees have been successfully paid. Thank you!'
                      : 'Your fees are currently unpaid. Please proceed with payment.'}
                  </p>

                  {!student.fees_paid && (
                    <Link href="/payment">
                      <Button
                        variant="gradient"
                        size="lg"
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <DollarSign className="h-5 w-5" />
                        <span>Pay Fees Now</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment History */}
        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment History</span>
                </CardTitle>
                <CardDescription>
                  Your recent fee payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Fee Payment
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.payment_method} ending in {transaction.card_last_four}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {transaction.status}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
