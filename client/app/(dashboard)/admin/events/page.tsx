'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Event } from '@/interface'
import Pills from '@/app/components/Pills'
import { FaCalendarAlt, FaClock, FaSearch, FaRegCalendarTimes } from 'react-icons/fa'
import { getAllEvents } from '@/services/event.service'
import { formatTime } from '@/utils/formatTime'

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchEvents = async () => {
    try {
        setLoading(true)
        const res = await getAllEvents()
        setEvents(res.data.data || [])
    } catch (error) {
        console.error("Failed to fetch events", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  

  const getDateParts = (dateString: string) => {
    const date = new Date(dateString)
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        year: date.getFullYear()
    }
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        {/* --- Header --- */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>School Events</h1>
                <p className='text-gray-500 text-sm'>Upcoming activities, holidays, and meetings.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <Link href="/admin/events/add" className="w-full sm:w-auto">
                    <div className="w-full flex justify-center">
                        <Pills label='Create Event' />
                    </div>
                </Link>
            </div>
        </div>

        {/* --- Content --- */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
        ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                    const { day, month, year } = getDateParts(event.event_date)
                    
                    return (
                        <div key={event.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-4">
                            
                            {/* Date Box */}
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-xl shrink-0 border border-blue-100">
                                <span className="text-xl font-bold leading-none">{day}</span>
                                <span className="text-xs font-bold uppercase mt-1">{month}</span>
                            </div>

                            {/* Event Details */}
                            <div className="flex flex-col justify-between h-16 py-0.5">
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1" title={event.title}>
                                        {event.title}
                                    </h3>
                                    <span className="text-xs text-gray-400">{year}</span>
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                    <FaClock className="text-gray-300 text-xs" />
                                    <span>
                                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                    </span>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
        ) : (
            // Empty State
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center'>
                <div className='bg-blue-50 p-4 rounded-full mb-4'>
                    <FaCalendarAlt className='text-3xl text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No events found</h3>
                <p className='text-gray-500 mb-6'>
                    {searchTerm ? "No events match your search." : "Plan the school year by adding upcoming events."}
                </p>
                {!searchTerm && (
                    <Link href="/admin/events/add">
                        <Pills label='Create Event' />
                    </Link>
                )}
            </div>
        )}
    </section>
  )
}

export default EventsPage