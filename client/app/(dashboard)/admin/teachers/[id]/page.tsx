'use client'

import { TeacherDetail } from '@/interface'
import { getTeacherById, removeTeacher } from '@/services/teacher.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { 
    FaArrowLeft, 
    FaEnvelope, 
    FaPhone, 
    FaChalkboardTeacher, 
    FaUser, 
    FaBook, 
    FaTrash, 
    FaExclamationTriangle, 
    FaEdit,
    FaCheckCircle
} from 'react-icons/fa'

const TeacherProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const teacherId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!teacherId) return

    const fetchTeacher = async () => {
        setLoading(true)
        try {
            const res = await getTeacherById(teacherId)
            setTeacher(res.data.data || res.data)
        } catch (error) {
            console.error("Failed to fetch teacher profile", error)
        } finally {
            setLoading(false)
        }
    }  

    fetchTeacher()
  }, [teacherId])

  const handleRemove = async () => {
    if (!teacherId) return
    setDeleting(true)
    try {
        await removeTeacher(teacherId)
        router.push('/admin/teachers')
    } catch (error) {
        console.error("Failed to delete", error)
        alert("Failed to delete teacher. Please try again.")
        setDeleting(false)
        setShowDeleteModal(false)
    }
  }

  const getInitials = (name: string) => {
      return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';
  }

  if (loading) {
    return (
      <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-pulse'>
         <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
         <div className="h-48 bg-gray-200 rounded-3xl w-full"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
         </div>
      </section>
    )
  }

  if (!teacher) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
            <h2 className="text-xl font-bold text-gray-800">Teacher Not Found</h2>
            <p className="text-gray-500 mt-2">The requested teacher profile does not exist.</p>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-4 font-medium">
                Go Back
            </button>
        </div>
    )
  }

  return (
    <section className='w-full max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 relative'>
        
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-gray-100">
                    <div className="p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg leading-6 font-bold text-gray-900">Remove Teacher?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Are you sure you want to remove <span className="font-bold text-gray-800">{teacher.teachername}</span>? This action cannot be undone and will revoke their system access immediately.
                        </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={handleRemove}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-base font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 transition-all"
                        >
                            {deleting ? 'Removing...' : 'Yes, Remove'}
                        </button>
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={() => setShowDeleteModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}

        <button 
            onClick={() => router.push('/admin/teachers')} 
            className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit font-bold text-xs uppercase tracking-widest'
        >
            <FaArrowLeft /> Back to Directory
        </button>

        <div className='bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden'>
            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-teal-500 to-emerald-600 opacity-10"></div>

            <div className='w-24 h-24 md:w-28 md:h-28 rounded-4xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl md:text-4xl font-black text-teal-600 z-10 shrink-0'>
                {getInitials(teacher.teachername)}
            </div>

            <div className='flex-1 text-center sm:text-left z-10 sm:pt-4'>
                <h1 className='text-2xl md:text-4xl font-black text-gray-900 wrap-break-word'>
                    {teacher.teachername}
                </h1>
                <div className='flex flex-wrap justify-center sm:justify-start gap-3 mt-3'>
                    <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100 uppercase tracking-wide'>
                        <FaChalkboardTeacher /> Teacher
                    </span>
                    {teacher.subject ? (
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100 uppercase tracking-wide'>
                            <FaBook /> {teacher.subject}
                        </span>
                    ) : (
                        <span className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200 uppercase tracking-wide'>
                            Unassigned
                        </span>
                    )}
                </div>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            <div className='bg-white p-6 rounded-4xl shadow-sm border border-gray-100 h-full flex flex-col'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-50'>
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                        <FaEnvelope size={18} />
                    </div>
                    <h2 className='text-lg font-bold text-gray-800 uppercase tracking-wide'>Contact Info</h2>
                </div>

                <div className='space-y-4 flex-1'>
                    <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                            <FaEnvelope />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                            <p className="font-bold text-gray-800 break-all">{teacher.teacheremail}</p>
                        </div>
                    </div>

                    <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                            <FaPhone />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                            <p className="font-bold text-gray-800">{teacher.teacherphone}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white p-6 rounded-4xl shadow-sm border border-gray-100 h-full flex flex-col'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-50'>
                    <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                        <FaUser size={18} />
                    </div>
                    <h2 className='text-lg font-bold text-gray-800 uppercase tracking-wide'>Professional Details</h2>
                </div>

                <div className='space-y-6 flex-1'>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                            <FaBook className="text-gray-300" /> Main Subject
                        </span>
                        <span className="font-bold text-right bg-purple-50 px-3 py-1 rounded-lg text-sm text-purple-700">
                            {teacher.subject || "Not Assigned"}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                            <FaCheckCircle className="text-gray-300" /> Status
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide">
                            Active
                        </span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button 
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
                        onClick={() => router.push(`/admin/teachers/${teacherId}/edit-profile`)}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                    <button
                        className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                        onClick={() => setShowDeleteModal(true)} 
                    >
                        <FaTrash /> Remove
                    </button>
                </div>
            </div>

        </div>

    </section>
  )
}

export default TeacherProfilePage