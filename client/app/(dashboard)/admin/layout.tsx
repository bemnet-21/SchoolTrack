import AuthGuard from '@/app/components/AuthGuard'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div>
        {children}
      </div>
    </AuthGuard>
  )
}

export default layout
