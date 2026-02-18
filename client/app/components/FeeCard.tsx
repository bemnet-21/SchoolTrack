'use client'

import { FeeCardProps } from '@/interface'
import { initializePayment } from '@/services/fee.service'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatTime'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa'

const FeeCard = ({ fee, isLoading }: FeeCardProps) => {
  const handleInitialization = async () => {
    try {
      const res = await initializePayment(fee.id)
      const paymentUrl = res.data.data.checkout_url
      console.log("URL", paymentUrl)
      window.location.href = paymentUrl

    } catch(err) {
      console.log("Failed to initialize payment")
    }
  }
  

  if (isLoading) {
    return (
      <div className='w-full bg-white p-5 rounded-4xl border border-gray-100 shadow-sm animate-pulse flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <div className='h-4 w-24 bg-gray-200 rounded' />
          <div className='h-6 w-16 bg-gray-100 rounded-full' />
        </div>
        <div className='h-8 w-32 bg-gray-200 rounded mt-2' />
        <div className='flex gap-4 mt-2'>
           <div className='h-4 w-20 bg-gray-100 rounded' />
           <div className='h-4 w-20 bg-gray-100 rounded' />
        </div>
      </div>
    )
  }

  // --- 2. DATA STATE ---
  return (
    <div className='w-full bg-white p-6 rounded-4xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 hover:shadow-md transition-all duration-300 relative overflow-hidden group'>
      
      {/* Background Icon Decoration */}
      <FaFileInvoiceDollar className='absolute -right-4 -bottom-4 text-gray-50 text-8xl rotate-12 group-hover:text-red-50/50 transition-colors' />

      <div className='relative z-10 space-y-4'>
        
        {/* Header: Term & Status */}
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-lg font-black text-gray-800 uppercase tracking-tight'>
              Term {fee.term} <span className='text-gray-400 font-medium ml-1'>/ {fee.year}</span>
            </h3>
            <p className='text-[10px] font-mono text-gray-400 mt-0.5 tracking-widest'>
              #{fee.invoice_no}
            </p>
          </div>
          <span className='flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100'>
             <FaExclamationCircle /> Unpaid
          </span>
        </div>

        {/* Amount Section */}
        <div className='py-2'>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Balance Due</p>
          <div className='flex items-baseline gap-1'>
            <span className='text-3xl font-black text-gray-900'>
              {formatCurrency(fee.amount)}
            </span>
          </div>
        </div>

        {/* Footer: Dates */}
        <div className='pt-4 border-t border-gray-50 flex flex-col gap-2'>
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-2 text-gray-400'>
               <FaCalendarAlt className='text-[10px]' />
               <span>Due Date:</span>
            </div>
            <span className='font-bold text-red-500'>
                {formatDate(fee.due_date)}
            </span>
          </div>

          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-2 text-gray-400'>
               <FaMoneyBillWave className='text-[10px]' />
               <span>Issued:</span>
            </div>
            <span className='font-medium text-gray-600'>
                {formatDate(fee.start_date)}
            </span>
          </div>
        </div>

        {/* Mobile Action (Prompt to pay) */}
        <button className='w-full mt-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg shadow-gray-200' onClick={handleInitialization}>
            Proceed to Payment
        </button>

      </div>
    </div>
  )
}

export default FeeCard