'use client'

import { TeacherDetail } from '@/interface'
import { getTeacherById } from '@/services/teacher.service'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEnvelope, FaPhone, FaChalkboardTeacher, FaUser, FaBook } from 'react-icons/fa'

const TeacherProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  // Ensure we get a single string ID
  const teacherId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return

    const getTeacher = async () => {
        setLoading(true)
        try {
            const res = await getTeacherById(teacherId)
            // Handle potentially nested data
            setTeacher(res.data.data || res.data)
        } catch (error) {
            console.error("Failed to fetch teacher profile", error)
        } finally {
            setLoading(false)
        }
    }  

    getTeacher()
  }, [teacherId])

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-pulse'>
         <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
         <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
         </div>
      </section>
    )
  }

  // --- Error State ---
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

  // Helper to get initials
  const getInitials = (name: string) => {
      return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';
  }

  return (
    <section className='w-full max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8'>
        
        {/* --- Navigation --- */}
        <button 
            onClick={() => router.back()} 
            className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit font-medium text-sm md:text-base'
        >
            <FaArrowLeft /> Back to Directory
        </button>

        {/* --- Header Card --- */}
        <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden'>
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-r from-teal-500 to-emerald-600 opacity-10"></div>

            {/* Avatar */}
            <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl md:text-3xl font-bold text-teal-600 z-10 shrink-0'>
                {getInitials(teacher.teachername)}
            </div>

            {/* Basic Info */}
            <div className='flex-1 text-center sm:text-left z-10 sm:pt-2'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 wrap-break-word'>
                    {teacher.teachername}
                </h1>
                <div className='flex flex-wrap justify-center sm:justify-start gap-3 mt-3'>
                    <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs md:text-sm font-semibold border border-teal-100'>
                        <FaChalkboardTeacher /> Teacher
                    </span>
                    {teacher.subject ? (
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs md:text-sm font-semibold border border-purple-100'>
                            <FaBook /> {teacher.subject}
                        </span>
                    ) : (
                        <span className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs md:text-sm font-medium'>
                            Unassigned Subject
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* --- Details Grid --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* Contact Information */}
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <FaEnvelope size={18} />
                    </div>
                    <h2 className='text-lg md:text-xl font-bold text-gray-800'>Contact Information</h2>
                </div>

                <div className='space-y-4'>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500 mt-0.5">
                            <FaEnvelope />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                            <p className="font-semibold text-gray-800 break-all">{teacher.teacheremail}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500 mt-0.5">
                            <FaPhone />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                            <p className="font-semibold text-gray-800">{teacher.teacherphone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Details */}
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <FaUser size={18} />
                    </div>
                    <h2 className='text-lg md:text-xl font-bold text-gray-800'>Professional Details</h2>
                </div>

                <div className='flex flex-col gap-6'>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Department / Subject</span>
                        <span className="font-bold text-gray-800 text-right">
                            {teacher.subject || "Not Assigned"}
                        </span>
                    </div>
                    <div className="pt-6 border-t border-gray-100 place-self-center">
                        <button className="py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm shadow-blue-200">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

        </div>

    </section>
  )
}

export default TeacherProfilePage