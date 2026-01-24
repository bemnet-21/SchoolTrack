'use client'

import { AddPeriods, ClassProps, CreateTimetable, SubjectProps, TeacherProps } from '@/interface'
import { getAllClasses } from '@/services/class.service'
import { getAllSubjects } from '@/services/subject.service' // Need to fetch subjects
import { getAllTeachers } from '@/services/teacher.service' // Need to fetch teachers
import { createTimetable } from '@/services/timetable.service' 
import { useRouter, useSearchParams } from 'next/navigation' // Use useSearchParams for initial classId
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaClock, FaBook, FaChalkboardTeacher, FaSave, FaTimes, FaLayerGroup } from 'react-icons/fa'

const AssignTimetablePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams() // To get classId from URL
  const initialClassId = searchParams.get('classId') || ''

  // --- Form States ---
  const [classId, setClassId] = useState<string>(initialClassId)
  const [day, setDay] = useState<string>('')
  // Initialize periods with 7 empty slots
  const [periods, setPeriods] = useState<AddPeriods[]>(
    Array.from({ length: 7 }, (_, i) => ({
      periodNumber: i + 1,
      subjectId: '',
      teacherId: '',
      startTime: '',
      endTime: '',
    }))
  )

  // --- Data & UI States ---
  const [classes, setClasses] = useState<ClassProps[]>([])
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [teachers, setTeachers] = useState<TeacherProps[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true) // For initial dropdown data fetch
  const [error, setError] = useState('')

  // 1. Fetch ALL necessary data for dropdowns on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setDataLoading(true)
      try {
        const [classesRes, subjectsRes, teachersRes] = await Promise.all([
          getAllClasses(),
          getAllSubjects(),
          getAllTeachers(),
        ])
        setClasses(classesRes.data.data || [])
        setSubjects(subjectsRes.data.data || [])
        setTeachers(teachersRes.data.data || [])

        // If classId was passed in URL, pre-select it
        if (initialClassId) {
            setClassId(initialClassId);
        } else if (classesRes.data.data && classesRes.data.data.length > 0) {
            // Otherwise, pre-select the first available class
            setClassId(classesRes.data.data[0].id);
        }

      } catch (err) {
        console.error('Failed to load initial data', err)
        setError('Failed to load required data for form.')
      } finally {
        setDataLoading(false)
      }
    }
    fetchInitialData()
  }, []) // Empty dependency array means run once on mount

  // 2. Handle changes for individual period fields
  const handleChangePeriod = (
    index: number,
    field: keyof Omit<AddPeriods, 'periodNumber'>, // Exclude periodNumber from direct change
    value: string
  ) => {
    setPeriods((prevPeriods) =>
      prevPeriods.map((period, i) =>
        i === index ? { ...period, [field]: value } : period
      )
    )
  }

  // 3. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic Validation
    if (!classId || !day) {
        setError('Please select a Class and a Day.')
        setLoading(false)
        return
    }

    // Validate each period
    for (const p of periods) {
        if (!p.subjectId || !p.teacherId || !p.startTime || !p.endTime) {
            setError(`Period ${p.periodNumber}: All fields are required.`)
            setLoading(false)
            return
        }
        if (p.startTime >= p.endTime) {
            setError(`Period ${p.periodNumber}: Start time must be before end time.`)
            setLoading(false)
            return
        }
    }

    const payload: CreateTimetable = {
      classId,
      day,
      periods,
    }

    console.log(payload) 
    try {
      await createTimetable(payload)
      router.push('/admin/timetable')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to assign timetable.')
    } finally {
      setLoading(false)
    }
  }

  // --- Render Loading State ---
  if (dataLoading) {
    return (
      <section className='w-full max-w-4xl mx-auto p-4 md:p-8 pt-12 md:pt-20 animate-pulse'>
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            {[...Array(7)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                    <div className="h-10 bg-gray-100 rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-100 rounded-lg flex-1"></div>
                </div>
            ))}
            <div className="h-12 w-full bg-blue-600 rounded-lg"></div>
        </div>
      </section>
    )
  }

  return (
    <section className='w-full max-w-4xl mx-auto p-4 md:p-8 pt-6 md:pt-8'>
        
        {/* Header */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Assign Timetable</h1>
            <p className='text-gray-500 mt-1'>Create a weekly schedule for a specific class and day.</p>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm flex items-center justify-center md:justify-start gap-2">
                <FaTimes /> {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100'>
            
            <div className='h-1.5 w-full bg-blue-600'></div>
            
            <div className='p-8 space-y-8'>
                
                {/* --- Class & Day Selection --- */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Class Selector */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Select Class</label>
                        <div className="relative">
                            <FaLayerGroup className="absolute left-4 top-3.5 text-gray-400" />
                            <select 
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                required
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white appearance-none transition-all'
                            >
                                <option value="">Choose Class</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} (Grade {cls.grade})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Day Selector */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Select Day</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                            <select 
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                required
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white appearance-none transition-all'
                            >
                                <option value="">Choose Day</option>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- Periods Input --- */}
                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2'>
                        <FaClock className="text-blue-500" /> Period Slots
                    </h2>
                    
                    <div className='grid grid-cols-1 gap-6'>
                        {periods.map((period, index) => (
                            <div key={period.periodNumber} className='bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 md:space-y-0 md:grid md:grid-cols-6 md:gap-4 md:items-end'>
                                <div className="md:col-span-1">
                                    <h3 className="font-bold text-gray-800 text-sm">Period {period.periodNumber}</h3>
                                    <p className="text-xs text-gray-500">Slot {period.periodNumber}</p>
                                </div>
                                
                                <div className="md:col-span-2 space-y-1">
                                    <label className='text-xs font-medium text-gray-700'>Subject</label>
                                    <select 
                                        value={period.subjectId}
                                        onChange={(e) => handleChangePeriod(index, 'subjectId', e.target.value)}
                                        required
                                        className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm bg-white appearance-none'
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className='text-xs font-medium text-gray-700'>Teacher</label>
                                    <select 
                                        value={period.teacherId}
                                        onChange={(e) => handleChangePeriod(index, 'teacherId', e.target.value)}
                                        required
                                        className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm bg-white appearance-none'
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} {teacher.subject_name ? `(${teacher.subject_name})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-1 grid grid-cols-2 gap-2">
                                    <div className='space-y-1'>
                                        <label className='text-xs font-medium text-gray-700'>Start</label>
                                        <input 
                                            type="time" 
                                            value={period.startTime}
                                            onChange={(e) => handleChangePeriod(index, 'startTime', e.target.value)}
                                            required
                                            className='w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <label className='text-xs font-medium text-gray-700'>End</label>
                                        <input 
                                            type="time" 
                                            value={period.endTime}
                                            onChange={(e) => handleChangePeriod(index, 'endTime', e.target.value)}
                                            required
                                            className='w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className='pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Assigning...' : <><FaSave /> Assign Timetable</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default AssignTimetablePage