'use client'

import StudentFeeCard from '@/app/components/StudentFeeCard'
import { StudentFeeCardProps } from '@/interface'
import { getChildrenFee } from '@/services/fee.service'
import React, { useEffect, useState } from 'react'
import { FaWallet, FaHistory, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa'

const BillingPage = () => {
  const [fees, setFees] = useState<StudentFeeCardProps[]>([])
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchFee = async (paidStatus: boolean) => {
    try {
      setLoading(true)
      const res = await getChildrenFee(paidStatus)
      const data = res.data.data
      setFees(data || [])
    } catch (err: any) {
      console.error("Failed to fetch fees", err.message)
      setFees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFee(isPaid)
  }, [isPaid])

  return (
    <section className='flex flex-col w-full max-w-7xl mx-auto gap-y-8 py-8 px-4 md:px-8 lg:px-16 min-h-screen bg-[#FAFBFF]'>
      
      {/* --- Header Section --- */}
      <div className='flex flex-col gap-y-2 border-b border-gray-100 pb-6'>
        <h1 className='text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3'>
          <FaWallet className="text-blue-600" />
          Billing & Fees
        </h1>
        <p className='text-gray-500 text-sm'>Monitor your children's tuition status and payment history.</p>
      </div>

      {/* --- Filter Toggles (Pill Style) --- */}
      <div className='flex flex-col gap-4'>
        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>
            Select Status
        </p>
        <div className='flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit'>
            <button 
                onClick={() => setIsPaid(false)}
                className={`flex-1 sm:px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                ${!isPaid ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <FaFileInvoiceDollar size={14} />
                Unpaid
            </button>
            <button 
                onClick={() => setIsPaid(true)}
                className={`flex-1 sm:px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                ${isPaid ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <FaHistory size={14} />
                History
            </button>
        </div>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='w-full h-40 bg-gray-100 rounded-4xl animate-pulse border border-gray-100' />
          ))}
        </div>
      ) : fees.length > 0 ? (
        // Data Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fees.map((fee) => (
                <StudentFeeCard
                    key={fee.id}
                    id={fee.id}
                    term={fee.term}
                    year={fee.year}
                    invoice_no={fee.invoice_no}
                    amount={fee.amount}
                    due_date={fee.due_date}
                    start_date={fee.start_date}
                    student_first_name={fee.student_first_name}
                    student_last_name={fee.student_last_name}
                    is_paid={fee.is_paid}
                />
            ))}
        </div>
      ) : (
        // Empty State
        <div className='py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center px-6'>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 
                ${isPaid ? 'bg-gray-50 text-gray-300' : 'bg-green-50 text-green-500'}`}
            >
                {isPaid ? <FaHistory size={40} /> : <FaCheckCircle size={40} />}
            </div>
            <h3 className='text-xl font-bold text-gray-800'>
                {isPaid ? "No payment history" : "All caught up!"}
            </h3>
            <p className='text-gray-400 text-sm mt-1 max-w-xs'>
                {isPaid 
                    ? "You haven't made any payments through the portal yet." 
                    : "There are no pending or overdue fees linked to your children."}
            </p>
        </div>
      )}

      {/* Footer Support */}
      <div className="mt-auto pt-10 text-center">
         <div className='bg-white border border-gray-100 p-4 rounded-2xl inline-block'>
            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                Billing questions? <span className='text-blue-600 cursor-pointer hover:underline'>Contact Finance Office</span>
            </p>
         </div>
      </div>

    </section>
  )
}

export default BillingPage