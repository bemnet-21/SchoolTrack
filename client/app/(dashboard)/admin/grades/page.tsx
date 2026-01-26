'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClassProps, GetGrade } from '@/interface'
import { getAllClasses } from '@/services/class.service'
import Pills from '@/app/components/Pills'
import { FaClipboardList, FaFilter, FaSearch, FaExclamationCircle } from 'react-icons/fa'
import { getGrades } from '@/services/grade.service'

const GradesPage = () => {
  const [classId, setClassId] = useState<string>('')
  const [term, setTerm] = useState<number>(1) 
  
  const [classes, setClasses] = useState<ClassProps[]>([])
  const [grades, setGrades] = useState<GetGrade[]>([])
  
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true) 
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClasses()
        const classList = res.data.data || []
        setClasses(classList)
        
        // if (classList.length > 0) {
        //     setClassId(classList[0].id)
        // }
      } catch (err) {
        console.error("Failed to load classes")
      } finally {
        setDataLoading(false)
      }
    }
    fetchClasses()
  }, [])

  useEffect(() => {
    if (!classId) return

    const fetchGrades = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getGrades(classId, term) 
        setGrades(res.data.data || [])
      } catch (err: any) {
        if(err.response && err.response.status === 404) {
            setGrades([])
        } else {
            console.error(err)
            setError("Failed to fetch results.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [classId, term])

  console.log("Grades: ", grades)
  console.log("Classes: ", classes)

  const allSubjects = Array.from(
    new Set(grades.flatMap(student => student.grades.map(s => s.subject)))
  ).sort();

  const getScoreCell = (student: GetGrade, subjectName: string) => {
    const subjectData = student.grades.find(s => s.subject === subjectName);
    if (!subjectData) return <span className="text-gray-300">-</span>;

    let colorClass = "text-gray-700";
    if (subjectData.grade === 'A' || subjectData.grade === 'A+') colorClass = "text-green-600 font-bold";
    if (subjectData.grade === 'F') colorClass = "text-red-600 font-bold";

    return (
        <div className="flex flex-col">
            <span className={`text-sm ${colorClass}`}>{subjectData.score}</span>
            <span className="text-[10px] text-gray-400">{subjectData.grade}</span>
        </div>
    );
  }

  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6'>
        
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div className='flex flex-col'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Student Grades</h1>
                <p className='text-gray-500 text-sm'>View academic performance and marksheets.</p>
            </div>
        
        </div>

        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4'>
            <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Class</label>
                <select 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className='w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-gray-50'
                >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>
            </div>

            <div className="w-full sm:w-48">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Term</label>
                <select 
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className='w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-gray-50'
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
        </div>

        {loading || dataLoading ? (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
                ))}
             </div>
        ) : grades.length > 0 ? (
            <>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'>
                                        Student Name
                                    </th>
                                    
                                    {allSubjects.map(subject => (
                                        <th key={subject} className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap'>
                                            {subject}
                                        </th>
                                    ))}

                                    <th className='px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-center bg-blue-50/50 border-l border-gray-100'>
                                        Total
                                    </th>
                                    <th className='px-6 py-4 text-xs font-bold text-purple-600 uppercase tracking-wider text-center bg-purple-50/50 border-l border-gray-100'>
                                        Avg
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {grades.map((student) => (
                                    <tr key={student.student_id} className='hover:bg-gray-50/50 transition-colors group'>
                                        
                                        {/* Name Cell */}
                                        <td className='px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-white group-hover:bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap'>
                                            {student.first_name} {student.last_name}
                                        </td>
                                        
                                        {/* Subject Cells */}
                                        {allSubjects.map(subject => (
                                            <td key={subject} className='px-6 py-4 text-center'>
                                                {getScoreCell(student, subject)}
                                            </td>
                                        ))}

                                        {/* Total Cell */}
                                        <td className='px-6 py-4 font-bold text-blue-700 text-center bg-blue-50/30 border-l border-gray-100'>
                                            {student.total}
                                        </td>

                                        {/* Average Cell */}
                                        <td className='px-6 py-4 font-bold text-purple-700 text-center bg-purple-50/30 border-l border-gray-100'>
                                            {student.overall_average}%
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='md:hidden grid grid-cols-1 gap-4'>
                    {grades.map((student) => (
                        <div key={student.student_id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-3 border-b border-gray-50 pb-2">
                                {student.first_name} {student.last_name}
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {student.grades.map((sub, idx) => (
                                    <div key={idx} className="bg-gray-50 p-2 rounded-lg flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-600 truncate mr-2">{sub.subject}</span>
                                        <div className="text-right">
                                            <span className="block font-bold text-sm text-gray-800">{sub.score}</span>
                                            <span className={`block text-[10px] font-bold ${
                                                sub.grade === 'F' ? 'text-red-500' : 'text-green-500'
                                            }`}>{sub.grade}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-auto max-w-lg text-center p-4'>
                <div className='bg-blue-50 p-4 rounded-full mb-4'>
                    <FaClipboardList className='text-3xl text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>No grades found</h3>
                <p className='text-gray-500 mb-6'>
                    No results uploaded for term {term} in this class yet.
                </p>
            </div>
        )}
    </section>
  )
}

export default GradesPage