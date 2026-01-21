'use client'

import { SubjectProps, TeacherCredentials } from '@/interface'
import { getAllSubjects } from '@/services/subject.service'
import { addTeacher } from '@/services/teacher.service'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaTimes, FaCheckCircle, FaCopy } from 'react-icons/fa'



const AddTeacherPage = () => {
  const router = useRouter()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')
  
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdCredentials, setCreatedCredentials] = useState<TeacherCredentials | null>(null)

  const fetchSubjects = async () => {
      try {
          const res = await getAllSubjects()
          setSubjects(res.data.data || [])
      } catch (err) {
          console.error("Failed to load subjects", err)
      }
  }
  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    
    try {
        const res = await addTeacher({ name, teacherEmail: email, teacherPhone: phone, subjectId })
        
        if (res.status === 201) {
            setCreatedCredentials(res.data.credentials)
        }
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to register teacher.")
    } finally {
        setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleClose = () => {
    setCreatedCredentials(null)
    router.push('/admin/teachers')
  }

  console.log({name, email, phone, subjectId})

  return (
    <section className='w-full max-w-3xl mx-auto p-4 md:p-8 relative'>

        {createdCredentials && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-600 p-6 text-center">
                        <FaCheckCircle className="text-white text-5xl mx-auto mb-2" />
                        <h2 className="text-2xl font-bold text-white">Teacher Registered!</h2>
                        <p className="text-green-100">Please share these credentials with the teacher.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                <p className="font-medium text-gray-800">{createdCredentials.email}</p>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Temporary Password</label>
                                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 mt-1">
                                    <span className="font-mono font-bold text-blue-600 tracking-wider">
                                        {createdCredentials.temporaryPassword}
                                    </span>
                                    <button 
                                        onClick={() => copyToClipboard(createdCredentials.temporaryPassword)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Copy"
                                    >
                                        <FaCopy />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleClose}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>
            </div>
        )}



        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Register New Teacher</h1>
            <p className='text-gray-500 mt-1'>Create a profile, assign a subject, and generate login credentials.</p>
        </div>


        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <FaTimes />
                <span>{error}</span>
            </div>
        )}



        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='h-1.5 w-full bg-blue-600'></div>
            
            <div className='p-8 space-y-6'>
                
                {/* Name */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Full Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            required
                            placeholder='e.g. Sarah Connor'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Email */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="email" 
                                required
                                placeholder='teacher@school.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="tel" 
                                required
                                placeholder='+1 234 567 890'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/* Subject Selection */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Assign Subject</label>
                    <div className="relative">
                        <FaBook className="absolute left-4 top-3.5 text-gray-400" />
                        <select 
                            required
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white appearance-none'
                        >
                            <option value="">Select a Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buttons */}
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
                        className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : <><FaSave /> Register Teacher</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default AddTeacherPage