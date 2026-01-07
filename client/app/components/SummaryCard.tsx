import { SummaryCardProps } from '@/interface'
import React from 'react'

const SummaryCard = ({ title, value, icon: Icon, iconClassName, iconBgColor }: SummaryCardProps) => {
  return (
    <div className={`bg-white w-2xs border border-gray-200 rounded-lg shadow-md p-6 mb-4`}>
        <div className='flex justify-between'>
            <h3 className='text-2xl font-bold text-black'>{title}</h3>
            <div className={`${iconBgColor}/20 p-2 rounded-lg`}>
                <Icon className={`${iconClassName}`} />
            </div>
        </div>
        <p className='text-4xl font-bold text-gray-900 mt-4'>{value}</p>
    </div>
  )
}

export default SummaryCard
