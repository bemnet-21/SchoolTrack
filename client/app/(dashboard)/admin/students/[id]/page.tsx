'use client'

import { StudentDetail } from '@/interface';
import { getStudentProfile } from '@/services/student.service';
import { formatDate } from '@/utils/formatTime'; // Ensure you have this
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaArrowLeft, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa'

const StudentProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const getStudent = async (studentId: string) => {
        try {
            setLoading(true)
            const res = await getStudentProfile(studentId)
            // Handle potentially nested data
            setStudent(res.data.data || res.data)
        } catch (error) {
            console.error("Failed to load student profile", error)
        } finally {
            setLoading(false)
        }
    }

    getStudent(id)
  }, [id])

  // --- Loading State ---
  if (loading) {
    return (
        <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
        </div>
    )
  }

  // --- Error State ---
  if (!student) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold text-gray-800">Student Not Found</h2>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-2">
                Go Back
            </button>
        </div>
    )
  }

  return (
    <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8'>
        
        {/* --- Back Button --- */}
        <button 
            onClick={() => router.push('/admin/students/')} 
            className='flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit font-medium'
        >
            <FaArrowLeft /> Back to Directory
        </button>

        {/* --- Profile Header --- */}
        <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden'>
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-blue-500 to-indigo-600 opacity-10"></div>

            {/* Avatar */}
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-indigo-600 z-10'>
                {student.studentfirstname?.[0]}{student.studentlastname?.[0]}
            </div>

            {/* Header Info */}
            <div className='flex-1 space-y-6 text-center md:text-left z-10 pt-2'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    {student.studentfirstname} {student.studentlastname}
                </h1>
                <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-3'>
                    <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100'>
                        ID: {student.id}
                    </span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100'>
                        {student.class || "Unassigned"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        student.studentgender.toLowerCase() === 'male' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-pink-50 text-pink-600 border-pink-100'
                    }`}>
                        {student.studentgender}
                    </span>
                </div>
            </div>
        </div>

        {/* --- Details Grid --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {/* 1. Academic & Personal Info */}
            <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <FaGraduationCap size={20} />
                    </div>
                    <h2 className='text-xl font-bold text-gray-800'>Academic & Personal</h2>
                </div>
                
                <div className='space-y-5'>
                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaBirthdayCake className="text-gray-400" />
                            <span className="font-medium text-sm">Date of Birth</span>
                        </div>
                        <span className="font-semibold text-gray-800">{formatDate(student.studentdob)}</span>
                    </div>

                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium text-sm">Grade Level</span>
                        </div>
                        <span className="font-semibold text-gray-800">{student.grade || "N/A"}</span>
                    </div>

                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaEnvelope className="text-gray-400" />
                            <span className="font-medium text-sm">Email</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-right max-w-50 truncate">
                            {student.studentemail || "Not Provided"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="font-medium text-sm">Address</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-right max-w-50 truncate">
                            {student.studentaddress || "Not Provided"}
                        </span>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 place-self-center">
                    <button className="py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm shadow-blue-200"
                    onClick={() => router.push(`/admin/students/${id}/edit-profile`)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* 2. Parent / Guardian Info */}
            <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <FaUser size={20} />
                    </div>
                    <h2 className='text-xl font-bold text-gray-800'>Parent / Guardian</h2>
                </div>

                <div className='space-y-5'>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</span>
                        <p className="text-lg font-semibold text-gray-800">{student.parentname}</p>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                            <FaPhone />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                            <p className="font-semibold text-gray-800">{student.parentphone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                            <FaEnvelope />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                            <p className="font-semibold text-gray-800 truncate">{student.parentemail}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </section>
  )
}

export default StudentProfilePage