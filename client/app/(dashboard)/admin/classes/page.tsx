'use client'

import ClassCard from '@/app/components/ClassCard'
import Pills from '@/app/components/Pills'
import { ClassProps } from '@/interface'
import { getAllClasses } from '@/services/class.service'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaLayerGroup } from 'react-icons/fa' 

const ClassesPage = () => {
  const [classes, setClasses] = useState<ClassProps[]>([])
  const [loading, setLoading] = useState(true)

  const getClasses = async () => {
    try {
        const res = await getAllClasses()
        const data = res.data.data || [] 
        setClasses(data)
    } catch (error) {
        console.error("Failed to fetch classes", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    getClasses()
  }, [])

  return (
    <section className='flex flex-col w-full max-w-7xl mx-auto gap-y-8 py-8 px-4 md:px-8 lg:px-12'>
        
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-3xl font-bold text-gray-800'>Class Management</h1>
                <p className='text-gray-500 text-sm'>Central directory for managing all classes in the school system.</p>
            </div>

            <Link href={'/admin/classes/add-class'} className="shrink-0">
                <Pills label='Add New Class' />
            </Link>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        ) : classes.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {classes.map((classItem) => (
                    <Link 
                        key={classItem.id} 
                        href={`/admin/classes/${classItem.id}`}
                        className="block h-full"
                    >
                        <ClassCard 
                            id={classItem.id} 
                            name={classItem.name} 
                            grade={classItem.grade} 
                            student_count={classItem.student_count} 
                            teacher_name={classItem.teacher_name} 
                        />
                    </Link>
                ))}
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300'>
                <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                    <FaLayerGroup className='text-3xl text-gray-300' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No classes found</h3>
                <p className='text-gray-500 mb-6'>Get started by adding a new class to the system.</p>
                <Pills label='Create First Class' />
            </div>
        )}
        
    </section>
  )
}

export default ClassesPage