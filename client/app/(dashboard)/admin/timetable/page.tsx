'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClassProps, GetPeriods, GetTimetable } from '@/interface' // Assuming you have ClassProps
import { getAllClasses } from '@/services/class.service' // To populate class dropdown
import { getTimetableForClass } from '@/services/timetable.service'
import { FaClock, FaCalendarAlt, FaLayerGroup, FaBook, FaChalkboardTeacher, FaPlus, FaRegCalendarTimes, FaTimes } from 'react-icons/fa'
import Pills from '@/app/components/Pills'
import Link from 'next/link'

const TimetablePage = () => {
  const router = useRouter()
  
  // --- State ---
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [classes, setClasses] = useState<ClassProps[]>([])
  const [timetable, setTimetable] = useState<GetTimetable[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // --- Fetch Classes for Dropdown ---
  useEffect(() => {
    const fetchClasses = async () => {
        try {
            const res = await getAllClasses()
            setClasses(res.data.data || [])
            // Automatically select the first class if available
            if (res.data.data && res.data.data.length > 0) {
                setSelectedClassId(res.data.data[0].id)
            }
        } catch (err) {
            console.error("Failed to load classes for dropdown", err)
            setError("Failed to load classes.")
        }
    }
    fetchClasses()
  }, [])

  // --- Fetch Timetable for Selected Class ---
  useEffect(() => {
    if (!selectedClassId) {
        setTimetable(null);
        setLoading(false);
        return;
    }

    const fetchTimetable = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getTimetableForClass(selectedClassId)
            setTimetable(res.data.data || []) // Backend sends data: rows (array of days)
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setTimetable([]); // No timetable set for this class
            } else {
                console.error("Failed to fetch timetable", err)
                setError(err.response?.data?.message || "Failed to load timetable.")
            }
        } finally {
            setLoading(false)
        }
    }
    fetchTimetable()
  }, [selectedClassId])

  // Helper: Format Time (14:00 -> 2:00 PM)
  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const formattedHour = h % 12 || 12
    return `${formattedHour}:${minutes}`
  }

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        {/* --- Header --- */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Timetable Management</h1>
                <p className='text-gray-500 text-sm'>View and manage class schedules for the week.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Class Selector */}
                <select 
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className='w-full sm:w-64 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white appearance-none'
                >
                    <option value="">Select a Class</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name} (Grade {cls.grade})
                        </option>
                    ))}
                </select>
                {/* Assign Timetable Button */}
                <Link href={`/admin/timetable/assign?classId=${selectedClassId}`} className="w-full sm:w-auto">
                    <div className="w-full flex justify-center">
                        <Pills label='Assign Timetable' />
                    </div>
                </Link>
            </div>
        </div>

        {/* --- Error Display --- */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200 text-sm flex items-center justify-center md:justify-start gap-2">
                <FaTimes /> {error}
            </div>
        )}

        {/* --- Content Area --- */}
        {loading ? (
            // Loading Skeleton for Daily Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        ) : timetable && timetable.length > 0 ? (
            // Timetable Grid (Desktop: multi-column, Mobile: 1-column stack)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {timetable.map((dayData) => (
                    <div key={dayData.day} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                        {/* Day Header */}
                        <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <FaCalendarAlt /> {/* Or FaClock if used for main nav */}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{dayData.day}</h3>
                        </div>

                        {/* Periods List for the Day */}
                        <div className="flex flex-col gap-3 grow">
                            {dayData.periods.map((period: GetPeriods) => (
                                <div key={period.periodNumber} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    {/* Period Number */}
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                                        {period.periodNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{period.subjectName}</p>
                                        <p className="text-xs text-gray-500 truncate">{period.teacherName}</p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 shrink-0">
                                        {formatTime(period.startTime)} - {formatTime(period.endTime)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // Empty State
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center'>
                <div className='bg-blue-50 p-4 rounded-full mb-4'>
                    <FaRegCalendarTimes className='text-3xl text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No timetable found</h3>
                <p className='text-gray-500 mb-6'>
                    {selectedClassId ? `No timetable set for this class.` : 'Please select a class to view its timetable.'}
                </p>
                {selectedClassId && ( // Show button only if a class is selected
                    <Link href={`/admin/timetable/assign?classId=${selectedClassId}`}>
                        <Pills label='Assign Timetable' />
                    </Link>
                )}
            </div>
        )}
    </section>
  )
}

export default TimetablePage