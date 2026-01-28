'use client'

import { AddGrade } from '@/interface'
import { addGrade } from '@/services/grade.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaArrowLeft, FaSave, FaTimes, FaHashtag } from 'react-icons/fa'

const AddGradePage = () => {
  const params = useParams()
  const router = useRouter()

  // IDs from the URL path: /teacher/classes/[id]/students/[studentId]/add-grade
  const studentId = params?.studentId as string
  const classId = params?.id as string

  // --- Form States ---
  const [term, setTerm] = useState<number>(1)
  const [score, setScore] = useState<number | string>('')
  
  // --- UI States ---
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (score === '' || Number(score) < 0 || Number(score) > 100) {
      setError("Please enter a valid score (0-100)")
      return
    }

    setLoading(true)
    setError('')

    const payload: AddGrade = {
      term,
      score: Number(score),
      classId,
      studentId
    }

    try {
      await addGrade(payload)
      router.push(`/teacher/classes/${classId}`) // Navigate back to roster
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save grade.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='w-full max-w-md mx-auto p-4 md:p-8 space-y-6 min-h-screen flex flex-col justify-center'>
      
      {/* Back Navigation */}
      <button 
        onClick={() => router.back()} 
        className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm w-fit'
      >
        <FaArrowLeft /> Back to Roster
      </button>

      {/* Header */}
      <div className='space-y-1'>
        <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Assign Grade</h1>
        <p className='text-gray-500 text-sm'>Enter the academic results below.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm flex items-center gap-2 animate-shake">
          <FaTimes /> {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleAddGrade} className='bg-white rounded-4xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden'>
        <div className='h-2 w-full bg-blue-600'></div>
        
        <div className='p-6 md:p-8 space-y-8'>
          
          {/* Term Selection - Using Large Buttons for Mobile */}
          <div className='space-y-3'>
            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
               Select Term
            </label>
            <div className='flex gap-2'>
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  className={`flex-1 py-4 rounded-2xl border-2 text-base font-black transition-all ${
                    term === t 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                      : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Score Input - Large & Bold for 393px visibility */}
          <div className='space-y-3'>
            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
              Score (0-100)
            </label>
            <div className='relative'>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-xl">
                <FaHashtag />
              </div>
              <input 
                type="number" 
                placeholder="0"
                min="0" 
                max="100"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className='w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none font-black text-4xl text-gray-800 transition-all placeholder:text-gray-200'
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='pt-4 flex flex-col gap-3'>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Saving...' : <><FaSave /> Save Grade</>}
            </button>
            
            <button 
              type="button"
              onClick={() => router.back()}
              className='w-full py-3 rounded-2xl text-gray-400 font-bold hover:text-gray-600 transition-all'
            >
              Cancel
            </button>
          </div>

        </div>
      </form>

      <div className="text-center">
         <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
            Secure Grade Entry System
         </span>
      </div>

    </section>
  )
}

export default AddGradePage