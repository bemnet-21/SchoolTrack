'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addSubject } from '@/services/subject.service'
import { FaBook, FaSave, FaTimes } from 'react-icons/fa'

const AddSubjectPage = () => {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name.trim()) {
        setError("Subject name is required.")
        setLoading(false)
        return
    }

    try {
        await addSubject(name) // Ensure service expects string or { name }
        router.push('/admin/subjects')
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to create subject.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <section className='w-full max-w-xl mx-auto p-4 md:p-8 pt-12 md:pt-20'>
        
        {/* Header */}
        <div className='mb-8 text-center md:text-left'>
            <h1 className='text-3xl font-bold text-gray-800'>Create New Subject</h1>
            <p className='text-gray-500 mt-1'>Add a new course or subject to the school curriculum.</p>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm flex items-center justify-center md:justify-start">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100'>
            
            <div className='space-y-6'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Subject Name</label>
                    <div className="relative">
                        <FaBook className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder='e.g. Mathematics'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            autoFocus
                        />
                    </div>
                    <p className="text-xs text-gray-400 pl-1">This name will appear in timetables and reports.</p>
                </div>

                {/* Actions */}
                <div className='pt-4 flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading || !name.trim()}
                        className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving...' : <><FaSave /> Create Subject</>}
                    </button>
                </div>
            </div>

        </form>
    </section>
  )
}

export default AddSubjectPage