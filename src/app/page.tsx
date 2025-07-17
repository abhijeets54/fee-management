'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, Shield, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'View and manage all student records in one place with real-time updates.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Protected login system ensuring only authorized access to student data.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant synchronization across all pages when payment status changes.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit"
            >
              <GraduationCap className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Student Fee Management System
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern, secure, and real-time solution for managing student fee payments.
              Track, update, and monitor payment status with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/all-students">
                <Button variant="gradient" size="lg" className="group">
                  View All Students
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Student Login
                </Button>
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link href="/setup" className="text-sm text-gray-600 hover:text-blue-600 underline">
                Need help setting up? Check database configuration →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage student fees efficiently and securely
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg w-fit"
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="gradient-card border-0 shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our platform today and experience seamless fee management
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button variant="gradient" size="lg">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/all-students">
                    <Button variant="outline" size="lg">
                      Browse Students
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
