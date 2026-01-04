import React from 'react'
import StoreProvider from '../components/StoreProvider'

const layout = ({ children } : { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <div>
        {children}  
      </div>
    </StoreProvider>
  )
}

export default layout
