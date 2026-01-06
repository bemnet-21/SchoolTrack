import AuthGuard from '@/app/components/AuthGuard'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard allowedRoles={['parent']}>
        {children}    
    </AuthGuard>
  )
}

export default layout
