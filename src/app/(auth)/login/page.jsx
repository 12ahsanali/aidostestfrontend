"use client"
import React from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

const page = () => {
  return (
    <>
    <AuthLayout>
       <LoginForm />
    </AuthLayout>
    </>
  )
}

export default page