'use client'

import { StudentFeeCardProps } from '@/interface'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatTime'
import React from 'react'
import { FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaUser, FaCalendarAlt, FaHashtag } from 'react-icons/fa'

const StudentFeeCard = ({ 
  start_date, 
  due_date, 
  is_paid, 
  student_first_name, 
  student_last_name, 
  amount, 
  invoice_no, 
  term, 
  year 
}: StudentFeeCardProps) => {

  

  return (
    <div className={`w-full bg-white p-5 md:p-6 rounded-4xl shadow-sm border border-gray-100 border-l-4 transition-all duration-300 relative overflow-hidden group hover:shadow-md
      ${is_paid ? 'border-l-green-500' : 'border-l-red-500'}`}
    >
      {/* Background Icon Decoration */}
      <FaFileInvoiceDollar className={`absolute -right-4 -bottom-4 text-8xl rotate-12 transition-colors opacity-5
        ${is_paid ? 'text-green-500' : 'text-red-500'}`} 
      />

      <div className='relative z-10 flex flex-col gap-4'>
        
        {/* Top Section: Child Name & Status */}
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-3'>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${is_paid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
            >
              <FaUser />
            </div>
            <div className='min-w-0'>
                <h3 className='text-sm font-black text-gray-400 uppercase tracking-widest'>Student</h3>
                <p className='text-lg font-black text-gray-800 truncate'>
                    {student_first_name} {student_last_name}
                </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5
            ${is_paid 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-red-50 text-red-600 border-red-100'}`}
          >
             {is_paid ? <FaCheckCircle /> : <FaExclamationCircle />}
             {is_paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>

        {/* Middle Section: Fee Details */}
        <div className='grid grid-cols-2 gap-4 py-2 border-y border-gray-50'>
            <div>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Term / Year</p>
                <p className='text-sm font-black text-gray-700'>Term {term} <span className='text-gray-300'>•</span> {year}</p>
            </div>
            <div className='text-right'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Amount</p>
                <p className={`text-xl font-black ${is_paid ? 'text-gray-800' : 'text-red-600'}`}>
                    {formatCurrency(amount)}
                </p>
            </div>
        </div>

        {/* Bottom Section: Metadata & Dates */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase'>
                    <FaHashtag />
                    <span>{invoice_no}</span>
                </div>
                <div className='flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase'>
                    <FaCalendarAlt />
                    <span>Due: {formatDate(due_date)}</span>
                </div>
            </div>

            {!is_paid && (
                <button className='w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95'>
                    Pay Now
                </button>
            )}
        </div>
      </div>
    </div>
  )
}

export default StudentFeeCard