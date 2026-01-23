'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FeeProps } from '@/interface'
import { getFees } from '@/services/fee.service'
import { formatDate } from '@/utils/formatTime'
import Pills from '@/app/components/Pills'
import { FaFileInvoiceDollar, FaFilter, FaCheckCircle, FaTimesCircle, FaPhone, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'

const FeesPage = () => {
  const [term, setTerm] = useState<number>(1)
  const [year, setYear] = useState<number>(new Date().getFullYear())  
  const [feeDetails, setFeeDetails] = useState<FeeProps[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFees = async (selectedTerm: number, selectedYear: number) => {
    setLoading(true)
    try {
        const res = await getFees(selectedTerm, selectedYear)
        const data = res.data.data || res.data
        setFeeDetails(Array.isArray(data) ? data : [])
    } catch (error: any) {
        if(error.response && error.response.status === 404) {
            setFeeDetails([])
            return
        }
        console.error("Failed to fetch fees", error)
        setFeeDetails([]) 
    } finally {
        setLoading(false)
    }
  }  

  useEffect(() => {
    fetchFees(term, year)
  }, [term, year])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount))
  }

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Fee Management</h1>
                <p className='text-gray-500 text-sm'>Track invoices, payments, and outstanding balances.</p>
            </div>
            
            <Link href="/admin/fees/assign" className="w-full md:w-auto">
                <div className="w-full flex justify-center md:justify-end">
                    <Pills label='Assign New Fee' />
                </div>
            </Link>
        </div>

        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center'>
            <div className='flex items-center gap-2 text-gray-500 text-sm font-medium w-full sm:w-auto'>
                <FaFilter /> Filters:
            </div>
            
            <div className="flex gap-4 w-full sm:w-auto">
                <select 
                    value={term} 
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className='flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-gray-50'
                >
                    <option value={1}>Term 1</option>
                    <option value={2}>Term 2</option>
                    <option value={3}>Term 3</option>
                </select>

                <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className='flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 w-24'
                />
            </div>
        </div>

        {loading ? (
            <div className="space-y-4 animate-pulse">
                <div className="md:hidden grid gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>)}
                </div>
                <div className="hidden md:block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>)}
                </div>
            </div>
        ) : feeDetails.length > 0 ? (
            <>
                <div className='hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Invoice No</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Student</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Amount</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Due Date</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Parent Contact</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {feeDetails.map((fee) => (
                                    <tr key={fee.id} className='hover:bg-gray-50/50 transition-colors'>
                                        <td className='px-6 py-4'>
                                            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                {fee.invoice_no}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 font-semibold text-gray-800'>
                                            {fee.first_name} {fee.last_name}
                                        </td>
                                        <td className='px-6 py-4 font-bold text-gray-700'>
                                            {formatCurrency(fee.amount)}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-500'>
                                            {formatDate(fee.due_date)}
                                        </td>
                                        <td className='px-6 py-4'>
                                            {fee.is_paid ? (
                                                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100'>
                                                    <FaCheckCircle /> Paid
                                                </span>
                                            ) : (
                                                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100'>
                                                    <FaTimesCircle /> Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaPhone className="text-gray-300 text-xs"/> 
                                                {fee.parent_phone || "N/A"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='md:hidden grid grid-cols-1 gap-4'>
                    {feeDetails.map((fee) => (
                        <div key={fee.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${fee.is_paid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            
                            <div className="pl-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono mb-1">{fee.invoice_no}</p>
                                        <h3 className="font-bold text-gray-800 text-lg">{fee.first_name} {fee.last_name}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        fee.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {fee.is_paid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs flex items-center gap-1"><FaMoneyBillWave/> Amount</span>
                                        <span className="font-bold text-gray-700">{formatCurrency(fee.amount)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs flex items-center gap-1"><FaCalendarAlt/> Due Date</span>
                                        <span className="font-medium text-gray-600">{formatDate(fee.due_date)}</span>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                            <FaPhone /> Parent Contact: <span className="text-gray-700 font-medium">{fee.parent_phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center p-4'>
                <div className='bg-blue-50 p-4 rounded-full mb-4'>
                    <FaFileInvoiceDollar className='text-3xl text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No fees found</h3>
                <p className='text-gray-500 mb-6'>
                    No records found for Term {term}, {year}.
                </p>
                <Link href="/admin/fees/assign">
                    <Pills label='Assign Fee' />
                </Link>
            </div>
        )}

    </section>
  )
}

export default FeesPage