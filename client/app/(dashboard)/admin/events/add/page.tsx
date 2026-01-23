'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addEvent } from '@/services/event.service' 
import { FaCalendarAlt, FaSave, FaTimes, FaClock, FaClipboardList } from 'react-icons/fa'

const AddEventPage = () => {
  const router = useRouter()
  
  const [title, setTitle] = useState<string>('')
  const [eventDate, setEventDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim() || !eventDate || !startTime || !endTime) {
        setError("All fields are required.")
        setLoading(false)
        return
    }

    if (startTime && endTime && startTime >= endTime) {
        setError("Start time must be before end time.");
        setLoading(false);
        return;
    }

    try {
        await addEvent({
            title,
            eventDate,
            startTime,
            endTime
        })
        router.push('/admin/events')
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to create event.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <section className='w-full max-w-xl mx-auto p-4 md:p-8 pt-12 md:pt-20'>
        
        {/* Header */}
        <div className='mb-8 text-center md:text-left'>
            <h1 className='text-3xl font-bold text-gray-800'>Create New Event</h1>
            <p className='text-gray-500 mt-1'>Schedule school-wide activities, meetings, or holidays.</p>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm flex items-center justify-center md:justify-start">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100'>
            
            <div className='h-1.5 w-full bg-blue-600'></div>
            
            <div className='p-8 space-y-6'>
                
                {/* Event Title */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Event Title</label>
                    <div className="relative">
                        <FaClipboardList className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder='e.g. Annual Sports Day'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            autoFocus
                        />
                    </div>
                </div>

                {/* Event Date */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>Event Date</label>
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="date" 
                            required
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                        />
                    </div>
                </div>

                {/* Start & End Time (Side-by-side on desktop) */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Start Time */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Start Time</label>
                        <div className="relative">
                            <FaClock className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="time" 
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                    </div>

                    {/* End Time */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>End Time</label>
                        <div className="relative">
                            <FaClock className="absolute left-4 top-3.5 text-gray-400" />
                            <input 
                                type="time" 
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
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
                        className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : <><FaSave /> Create Event</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default AddEventPage