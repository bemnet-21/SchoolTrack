'use client'

import { AssignSubjectsToClassInterface, SubjectsInfoInterface, SubjectProps, TeacherProps } from '@/interface'
import { getAllSubjects } from '@/services/subject.service'
import { getAllTeachers } from '@/services/teacher.service'
import { assignSubjectsToClass } from '@/services/class.service' // Assuming this is where it's stored
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaBook, FaChalkboardTeacher, FaPlus, FaTrash, FaSave, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa'

const AssignSubjectsPage = () => {
  const params = useParams()
  const router = useRouter()
  const classId = params?.id as string

  // --- Data for Dropdowns ---
  const [availableSubjects, setAvailableSubjects] = useState<SubjectProps[]>([])
  const [availableTeachers, setAvailableTeachers] = useState<TeacherProps[]>([])

  // --- Form States ---
  const [subjectId, setSubjectId] = useState<string>('')
  const [teacherId, setTeacherId] = useState<string>('')
  
  // --- The List to be Submitted ---
  const [subjectsList, setSubjectsList] = useState<SubjectsInfoInterface[]>([])

  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState('')

  // 1. Fetch available data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, teaRes] = await Promise.all([getAllSubjects(), getAllTeachers()])
        setAvailableSubjects(subRes.data.data || [])
        setAvailableTeachers(teaRes.data.data || [])
      } catch (err) {
        setError("Failed to load subjects or teachers.")
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  // 2. Add subject-teacher pair to local list
  const addToList = () => {
    if (!subjectId || !teacherId) return
    
    // Prevent duplicates in the local list
    if (subjectsList.find(item => item.subjectId === subjectId)) {
        alert("This subject is already in your list.")
        return
    }

    const newItem: SubjectsInfoInterface = { subjectId, teacherId }
    setSubjectsList([...subjectsList, newItem])
    
    // Reset local selection for next entry
    setSubjectId('')
    setTeacherId('')
  }

  // 3. Remove from local list
  const removeFromList = (subId: string) => {
    setSubjectsList(subjectsList.filter(item => item.subjectId !== subId))
  }

  // 4. Submit to Backend
  const handleFinalSubmit = async () => {
    if (subjectsList.length === 0) {
        setError("Please add at least one subject to the list.")
        return
    }

    setLoading(true)
    setError('')

    const payload: AssignSubjectsToClassInterface = {
        classId,
        subjects: subjectsList
    }

    try {
        await assignSubjectsToClass(payload)
        router.push(`/admin/classes/${classId}`) // Go back to class details
    } catch (err: any) {
        setError(err.response?.data?.message || "Internal server error")
    } finally {
        setLoading(false)
    }
  }

  if (dataLoading) return <div className='p-8 animate-pulse text-gray-400'>Loading...</div>

  return (
    <section className='w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6'>
        
        {/* Header */}
        <div className='flex flex-col gap-2'>
            <button onClick={() => router.back()} className='flex items-center gap-2 text-gray-500 hover:text-blue-600 w-fit text-sm transition-colors'>
                <FaArrowLeft /> Back to Class
            </button>
            <h1 className='text-3xl font-extrabold text-gray-800'>Assign Subjects</h1>
            <p className='text-gray-500 text-sm'>Link subjects and teachers to this classroom.</p>
        </div>

        {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm'>
                <FaExclamationCircle /> {error}
            </div>
        )}

        {/* --- Entry Form --- */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-4'>Add New Assignment</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
                
                {/* Subject Dropdown */}
                <div className='lg:col-span-2 space-y-2'>
                    <label className='text-xs font-bold text-gray-600 ml-1'>Subject</label>
                    <select 
                        value={subjectId} 
                        onChange={(e) => setSubjectId(e.target.value)}
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm'
                    >
                        <option value="">Select Subject</option>
                        {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                {/* Teacher Dropdown */}
                <div className='lg:col-span-2 space-y-2'>
                    <label className='text-xs font-bold text-gray-600 ml-1'>Teacher</label>
                    <select 
                        value={teacherId} 
                        onChange={(e) => setTeacherId(e.target.value)}
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm'
                    >
                        <option value="">Select Teacher</option>
                        {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>

                {/* Add to List Button */}
                <button 
                    onClick={addToList}
                    disabled={!subjectId || !teacherId}
                    className='w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 transition-all flex items-center justify-center gap-2'
                >
                    <FaPlus /> <span className='md:hidden lg:inline'>Add</span>
                </button>
            </div>
        </div>

        {/* --- Local List Table --- */}
        <div className='space-y-4'>
            <h2 className='text-xl font-bold text-gray-800'>Assignment List ({subjectsList.length})</h2>
            
            {subjectsList.length > 0 ? (
                <div className='grid grid-cols-1 gap-3'>
                    {subjectsList.map((item, index) => {
                        const subName = availableSubjects.find(s => s.id === item.subjectId)?.name
                        const teaName = availableTeachers.find(t => t.id === item.teacherId)?.name
                        
                        return (
                            <div key={index} className='flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2'>
                                <div className='flex items-center gap-6'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] text-gray-400 font-bold uppercase'>Subject</span>
                                        <span className='font-bold text-gray-800 flex items-center gap-2'><FaBook className='text-blue-500 text-xs' /> {subName}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] text-gray-400 font-bold uppercase'>Teacher</span>
                                        <span className='font-medium text-gray-600 flex items-center gap-2'><FaChalkboardTeacher className='text-purple-500 text-xs' /> {teaName}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromList(item.subjectId)}
                                    className='p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className='bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center text-gray-400'>
                    No subjects added to the list yet.
                </div>
            )}
        </div>

        {/* --- Final Action --- */}
        <div className='pt-6 border-t border-gray-100 flex justify-end'>
            <button 
                onClick={handleFinalSubmit}
                disabled={loading || subjectsList.length === 0}
                className='w-full md:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:bg-gray-300'
            >
                {loading ? 'Processing...' : <><FaSave /> Save All Assignments</>}
            </button>
        </div>

    </section>
  )
}

export default AssignSubjectsPage