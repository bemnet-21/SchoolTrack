'use client'

import { ClassProps } from '@/interface'
import { getAllClasses } from '@/services/class.service'
import { assignFee } from '@/services/fee.service'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaMoneyBillWave, FaCalendarAlt, FaLayerGroup, FaSave, FaTimes, FaCalendarCheck } from 'react-icons/fa'

const AssignFeePage = () => {
  const router = useRouter()

  // --- Form States ---
  const [amount, setAmount] = useState<number | ''>('') // Allow empty string for better UX
  const [term, setTerm] = useState<number>(1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [startDate, setStartDate] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [classId, setClassId] = useState<string>('')
  
  // --- Data & UI States ---
  const [classes, setClasses] = useState<ClassProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Fetch Classes for Dropdown
  useEffect(() => {
    const fetchClasses = async () => {
        try {
            const res = await getAllClasses()
            setClasses(res.data.data || [])
        } catch (err) {
            console.error("Failed to load classes")
        }
    }
    fetchClasses()
  }, [])

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic Validation
    if (!amount || !startDate || !dueDate || !classId) {
        setError("All fields are required.")
        setLoading(false)
        return
    }

    try {
        await assignFee({
            amount: Number(amount),
            term,
            year,
            startDate,
            dueDate,
            classId
        })
        // Success! Redirect to Fees List
        router.push('/admin/fees')
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.error || "Failed to assign fees.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <section className='w-full max-w-3xl mx-auto p-4 md:p-8'>
        
        {/* Header */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Assign Class Fee</h1>
            <p className='text-gray-500 mt-1'>Create a bulk invoice for all students in a specific class.</p>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <FaTimes /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='h-1.5 w-full bg-blue-600'></div>
            
            <div className='p-8 space-y-8'>
                
                {/* --- Section 1: Fee Details --- */}
                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2'>
                        <FaMoneyBillWave className="text-blue-500" /> Fee Details
                    </h2>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Class Selection */}
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Target Class</label>
                            <div className="relative">
                                <FaLayerGroup className="absolute left-4 top-3.5 text-gray-400" />
                                <select 
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                    required
                                    className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white appearance-none transition-all'
                                >
                                    <option value="">Select a Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.student_count} Students)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Amount ($)</label>
                            <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                placeholder='0.00'
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>

                        {/* Academic Year */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Academic Year</label>
                            <input 
                                type="number" 
                                required
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50'
                            />
                        </div>

                        {/* Term */}
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Term</label>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((t) => (
                                    <label key={t} className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${term === t ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-200'}`}>
                                        <input 
                                            type="radio" 
                                            name="term" 
                                            value={t} 
                                            checked={term === t} 
                                            onChange={() => setTerm(t)}
                                            className="hidden"
                                        />
                                        Term {t}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: Dates --- */}
                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2'>
                        <FaCalendarAlt className="text-blue-500" /> Timeline
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Start Date</label>
                            <input 
                                type="date" 
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Due Date</label>
                            <input 
                                type="date" 
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className='pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Assigning...' : <><FaSave /> Assign Fees</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default AssignFeePage