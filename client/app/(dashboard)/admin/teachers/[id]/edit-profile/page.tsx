'use client'

import { SubjectProps } from '@/interface' // Ensure you have this
import { getTeacherById, updateTeacherProfile } from '@/services/teacher.service'
import { getAllSubjects } from '@/services/subject.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaArrowLeft, FaTimes } from 'react-icons/fa'

const EditTeacherPage = () => {
  const params = useParams()
  const router = useRouter()
  const teacherId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [name, setName] = useState<string>('')
  const [teacherEmail, setTeacherEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')

  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!teacherId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [teacherRes, subjectRes] = await Promise.all([
          getTeacherById(teacherId),
          getAllSubjects()
        ])

        const teacherData = teacherRes.data.data
        const subjectData = subjectRes.data.data

        setName(teacherData.name || '')
        setTeacherEmail(teacherData.email || '')
        setPhone(teacherData.phone || '')
        const matchingSub = subjectData.find((s: any) => s.name === teacherData.subject || s.id === teacherData.subject_id)
        setSubjectId(matchingSub ? matchingSub.id : '')

        setSubjects(subjectData || [])
      } catch (err: any) {
        console.error("Error fetching data", err)
        setError("Failed to load teacher details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teacherId])

  // 2. Handle Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId) return

    setSaving(true)
    setError('')

    const payload = {
      name,
      teacherEmail, 
      phone: phone, 
      subjectId
    }

    try {
      await updateTeacherProfile(teacherId, payload)
      router.push(`/admin/teachers/${teacherId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  console.log("name", name)
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-6">
            <div className="h-10 bg-gray-100 rounded-lg w-full" />
            <div className="h-10 bg-gray-100 rounded-lg w-full" />
            <div className="h-10 bg-gray-100 rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <section className='w-full max-w-3xl mx-auto p-4 md:p-8 space-y-6'>
        
        <button 
            onClick={() => router.back()} 
            className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest'
        >
            <FaArrowLeft /> Cancel & Go Back
        </button>

        <div>
            <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Edit Teacher Profile</h1>
            <p className='text-gray-500 text-sm mt-1'>Update personal details and subject assignment.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100'>
            <div className='space-y-6'>
                
                <div className='space-y-2'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider ml-1'>Full Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-400 uppercase tracking-wider ml-1'>Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="email" 
                                required
                                value={teacherEmail}
                                onChange={(e) => setTeacherEmail(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all'
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-400 uppercase tracking-wider ml-1'>Phone</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="tel" 
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <label className='text-xs font-bold text-gray-400 uppercase tracking-wider ml-1'>Assigned Subject</label>
                    <div className="relative">
                        <FaBook className="absolute left-4 top-3.5 text-gray-400" />
                        <select 
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none bg-white appearance-none cursor-pointer'
                        >
                            <option value="">Select a Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div className='h-px bg-gray-100 w-full my-2' />

                {/* Buttons */}
                <div className='flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className={`px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default EditTeacherPage