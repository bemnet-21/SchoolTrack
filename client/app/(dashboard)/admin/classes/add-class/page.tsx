'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addClass } from '@/services/class.service'
import { getAllTeachers } from '@/services/teacher.service' // Need this to populate dropdown
import { AddClassInterface, TeacherProps } from '@/interface'
import { FaLayerGroup, FaChalkboardTeacher, FaSave, FaTimes } from 'react-icons/fa'

const AddClassPage = () => {
  const router = useRouter()
  
  // Form States
  const [name, setName] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [teacherId, setTeacherId] = useState<string>('')
  
  // Data States
  const [teachers, setTeachers] = useState<TeacherProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Fetch Teachers on Mount
  useEffect(() => {
    const fetchTeachers = async () => {
        try {
            const res = await getAllTeachers()
            setTeachers(res.data.data || [])
        } catch (err: any) {
            if(err.response && err.response.status === 404) {
                setTeachers([])
            } else {
                console.error("Failed to load teachers ", err)
            }
        }
    }
    fetchTeachers()
  }, [])

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name || !grade) {
        setError("Class Name and Grade are required.")
        setLoading(false)
        return
    }

    try {
        await addClass({ name, grade, teacherId })
        // Success! Redirect back to list
        router.push('/admin/classes')
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to create class.")
    } finally {
        setLoading(false)
    }
  } 

  return (
    <section className='w-full max-w-2xl mx-auto p-4 md:p-8'>
        
        {/* Header */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Create New Class</h1>
            <p className='text-gray-500 mt-1'>Assign a name, grade level, and class teacher to create a new section.</p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6'>
            
            {/* Class Name */}
            <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Class Name</label>
                <div className="relative">
                    <FaLayerGroup className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder='e.g. Grade 10 A'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                    />
                </div>
            </div>

            {/* Grade Level */}
            <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Grade Level</label>
                <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white text-gray-700'
                >
                    <option value="">Select Grade</option>
                    {[9, 10, 11, 12].map(g => (
                        <option key={g} value={g.toString()}>{g}</option>
                    ))}
                </select>
            </div>

            {/* Teacher Selection */}
            <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Assign Teacher (Optional)</label>
                <div className="relative">
                    <FaChalkboardTeacher className="absolute left-4 top-3.5 text-gray-400" />
                    <select 
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white text-gray-700 appearance-none'
                    >
                        <option value="">Select a Class Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} {teacher.subject_name ? `(${teacher.subject_name})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className='pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3'>
                <button 
                    type="button"
                    onClick={() => router.back()}
                    className='px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                >
                    <FaTimes /> Cancel
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating...' : <><FaSave /> Create Class</>}
                </button>
            </div>

        </form>
    </section>
  )
}

export default AddClassPage