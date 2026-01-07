import React from 'react'
import EventCard from './EventCard' // Assuming your component is here
import { FaCalendarAlt, FaEllipsisH } from 'react-icons/fa'

interface EventsSectionProps {
  events: any[]; // Replace 'any' with your Event interface
}

const UpcomingEvents = ({ events }: EventsSectionProps) => {
  return (
    <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-80 h-full flex flex-col'>
        
        {/* 2. Header: Flex row with Title and "More" option */}
        <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
                {/* Visual Icon */}
                <div className='bg-blue-50 p-2 rounded-lg text-blue-600'>
                    <FaCalendarAlt />
                </div>
                <h2 className='text-lg font-bold text-gray-800'>Upcoming Events</h2>
            </div>
        </div>

        <div className='flex flex-col gap-4 overflow-y-auto max-h-100 pr-2 custom-scrollbar'>
            
            {/* Check if events exist and has items */}
            {events && events.length > 0 ? (
                events.map((event) => (
                    <EventCard 
                        key={event.id} 
                        id={event.id}
                        title={event.title} 
                        start_time={event.start_time} 
                        end_time={event.end_time} 
                        event_date={event.event_date} 
                    />
                ))
            ) : (
                <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
                    <p className='text-sm'>No upcoming events</p>
                </div>
            )}
            
        </div>
    </section>
  )
}

export default UpcomingEvents