'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { initializeDatabase } from '@/lib/database-init'

export default function SetupPage() {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    details?: unknown;
  } | null>(null)

  const checkDatabase = async () => {
    setChecking(true)
    setResult(null)
    
    try {
      const dbResult = await initializeDatabase()
      setResult(dbResult)
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to check database',
        details: error
      })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Database Setup
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Check if your database is properly configured for the Student Fee Management System
          </p>
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to set up your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create Supabase Project</p>
                    <p className="text-sm text-gray-600">
                      Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Set Environment Variables</p>
                    <p className="text-sm text-gray-600">
                      Add your Supabase URL and anon key to <code className="bg-gray-100 px-1 rounded">.env.local</code>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Run Database Schema</p>
                    <p className="text-sm text-gray-600">
                      Copy and paste the contents of <code className="bg-gray-100 px-1 rounded">database-schema.sql</code> into your Supabase SQL Editor and run it
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Enable Real-time</p>
                    <p className="text-sm text-gray-600">
                      Go to Database → Replication and enable real-time for <code className="bg-gray-100 px-1 rounded">students</code> and <code className="bg-gray-100 px-1 rounded">transactions</code> tables
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Database Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Database Status Check</CardTitle>
              <CardDescription>
                Click the button below to verify your database setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={checkDatabase}
                disabled={checking}
                variant="gradient"
                className="w-full"
              >
                {checking ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Checking Database...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>Check Database Setup</span>
                  </div>
                )}
              </Button>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.success ? 'Database Setup Complete!' : 'Database Setup Required'}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.success ? result.message : result.error}
                  </p>

                  {!result.success && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Next Steps:</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Make sure you&apos;ve created a Supabase project</li>
                        <li>• Verify your environment variables are correct</li>
                        <li>• Run the database-schema.sql file in your Supabase SQL Editor</li>
                        <li>• Enable real-time for the required tables</li>
                      </ul>
                    </div>
                  )}

                  {result.success && (
                    <div className="mt-3">
                      <p className="text-sm text-green-700 mb-2">
                        Your database is ready! You can now:
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/signup">Create Account</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/all-students">View Students</a>
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
