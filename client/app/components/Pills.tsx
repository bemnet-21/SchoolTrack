import { PillProps } from '@/interface'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const Pills = ({ label, className } : PillProps) => {
  return (
    <div className={`bg-mainBlue text-white flex items-center gap-x-2 px-4 py-2 w-fit rounded-lg shadow-md cursor-pointer hover:opacity-90 transition active:scale-95 active:shadow-sm ${className}`}>
      <FaPlus />
      <div>{label}</div>
    </div>
  )
}

export default Pills
