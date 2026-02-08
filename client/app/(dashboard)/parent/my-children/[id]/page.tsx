'use client'

import GradeCard from '@/app/components/GradeCard' 
import { StudentDetail, StudentsGradeInterface } from '@/interface'
import { getGradeForStudent } from '@/services/grade.service'
import { getStudentProfile } from '@/services/student.service'
import { formatDate } from '@/utils/formatTime'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaUserGraduate, FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUserShield, FaSchool, FaChartBar, FaChevronDown } from 'react-icons/fa'

const ChildDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const childId = Array.isArray(params?.id) ? params.id[0] : params?.id
  
  const [childDetail, setChildDetail] = useState<StudentDetail | null>(null)
  const [grades, setGrades] = useState<StudentsGradeInterface[]>([])
  const [term, setTerm] = useState<number>(1)
  
  const [loading, setLoading] = useState(true)
  const [gradesLoading, setGradesLoading] = useState(false)

  const fetchData = async (id: string, selectedTerm: number) => {
    try {
      setLoading(true)
      const res = await getStudentProfile(id)
      setChildDetail(res.data.data)
      
      const gradeRes = await getGradeForStudent(selectedTerm, id)
      setGrades(gradeRes.data.data || [])
    } catch (err) {
      console.error("Error fetching details", err)
      setChildDetail(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchGradesOnly = async (selectedTerm: number) => {
    if (!childId) return
    setGradesLoading(true)
    try {
      const res = await getGradeForStudent(selectedTerm, childId)
      setGrades(res.data.data || [])
    } catch (err) {
      setGrades([])
    } finally {
      setGradesLoading(false)
    }
  }

  useEffect(() => {
    if (childId) {
      fetchData(childId, term)
    }
  }, [childId])

  useEffect(() => {
    if (!loading && childId) {
        fetchGradesOnly(term)
    }
  }, [term])

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-100 rounded-[2.5rem] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-[2.5rem]" />
          <div className="h-64 bg-gray-100 rounded-[2.5rem]" />
        </div>
      </div>
    )
  }

  if (!childDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <FaUserGraduate className="text-gray-200 text-6xl mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Child record not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline">Go Back</button>
      </div>
    )
  }

  return (
    <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 min-h-screen'>
      
      {/* --- Navigation --- */}
      <button 
        onClick={() => router.back()} 
        className='flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]'
      >
        <FaArrowLeft /> Back to List
      </button>

      {/* --- Profile Header Card --- */}
      <div className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden'>
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
        <div className='w-24 h-24 md:w-32 md:h-32 rounded-4xl bg-blue-50 flex items-center justify-center text-4xl font-black text-blue-600 shadow-inner shrink-0'>
          {childDetail.studentfirstname?.[0]}{childDetail.studentlastname?.[0]}
        </div>
        <div className='flex-1 text-center md:text-left space-y-3'>
          <h1 className='text-3xl md:text-4xl font-black text-gray-900 tracking-tight'>
              {childDetail.studentfirstname} {childDetail.studentlastname}
          </h1>
          <div className='flex flex-wrap justify-center md:justify-start gap-2'>
            <span className='px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black border border-blue-100 uppercase'>ID: {childDetail.id}</span>
            <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black border border-indigo-100 uppercase'>Grade {childDetail.grade}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase ${childDetail.studentgender.toLowerCase() === 'male' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>{childDetail.studentgender}</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        
        {/* Personal Info */}
        <div className='bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6'>
            <h3 className='text-sm font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-4 flex items-center gap-2'>
                <FaSchool className='text-blue-500' /> Academic & Personal
            </h3>
            <div className='space-y-5'>
                <div className='flex justify-between items-center'><span className='text-gray-400 text-sm font-bold flex items-center gap-2'><FaBirthdayCake /> Date of Birth</span><span className='font-bold text-gray-700'>{formatDate(childDetail.studentdob)}</span></div>
                <div className='flex justify-between items-center'><span className='text-gray-400 text-sm font-bold flex items-center gap-2'><FaEnvelope /> Email</span><span className='font-bold text-gray-700 text-right truncate max-w-40 italic'>{childDetail.studentemail}</span></div>
                <div className='flex justify-between items-start'><span className='text-gray-400 text-sm font-bold flex items-center gap-2 mt-1'><FaMapMarkerAlt /> Address</span><span className='font-bold text-gray-700 text-right max-w-40'>{childDetail.studentaddress || 'N/A'}</span></div>
            </div>
        </div>

        {/* Guardian Info */}
        <div className='bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6'>
            <h3 className='text-sm font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-4 flex items-center gap-2'>
                <FaUserShield className='text-red-500' /> Guardian Details
            </h3>
            <div className='space-y-4'>
                <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'><p className='text-[10px] font-black text-gray-400 uppercase mb-1'>Full Name</p><p className='font-black text-gray-800 text-lg'>{childDetail.parentname}</p></div>
                <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl'><div className='w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center'><FaPhone /></div><div className='flex-1'><p className='text-[10px] font-black text-gray-400 uppercase'>Phone</p><p className='font-bold text-gray-800'>{childDetail.parentphone}</p></div></div>
                <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl'><div className='w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center'><FaEnvelope /></div><div className='flex-1 min-w-0'><p className='text-[10px] font-black text-gray-400 uppercase'>Email</p><p className='font-bold text-gray-800 truncate'>{childDetail.parentemail}</p></div></div>
            </div>
        </div>

        <div className='md:col-span-2 space-y-4'>
            <div className='flex items-center justify-between px-2'>
                <div className='flex items-center gap-2'>
                    <FaChartBar className='text-indigo-500' />
                    <h3 className='text-sm font-black text-gray-400 uppercase tracking-[0.2em]'>Academic Performance</h3>
                </div>
                
                {/* Term Dropdown */}
                <div className='relative'>
                    <select 
                        value={term} 
                        onChange={(e) => setTerm(Number(e.target.value))}
                        className='appearance-none bg-white border border-gray-200 px-4 py-1.5 pr-8 rounded-full text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600 transition-all cursor-pointer'
                    >
                        <option value={1}>Term 1</option>
                        <option value={2}>Term 2</option>
                        <option value={3}>Term 3</option>
                    </select>
                    <FaChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 pointer-events-none' />
                </div>
            </div>

            <div className='w-full'>
                <GradeCard grades={grades} isLoading={gradesLoading} />
            </div>
        </div>

      </div>

      <div className="pt-10 text-center">
         <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Official Student Record</span>
      </div>
    </section>
  )
}

export default ChildDetailPage