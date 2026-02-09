"use client"
import React from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'

const page = () => {
  return (
    <AuthLayout>
      <SignupForm/>
    </AuthLayout>
  )
}

export default page 