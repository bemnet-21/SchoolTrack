'use client'

import { StudentsGradeInterface } from '@/interface'
import { getGradeForStudent } from '@/services/grade.service'
import React, { useEffect, useState } from 'react'
import { FaAward, FaChalkboardTeacher, FaClipboardCheck, FaExclamationCircle, FaFilter } from 'react-icons/fa'

const StudentGradesPage = () => {
  const [term, setTerm] = useState<number>(1)
  const [grades, setGrades] = useState<StudentsGradeInterface[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGrade = async (selectedTerm: number) => {
    setLoading(true)
    try {
      const res = await getGradeForStudent(selectedTerm)
      // Assuming res.data.data contains the array
      setGrades(res.data.data || [])
    } catch(err: any) {
        if(err.response && err.response.status === 404) {
            setGrades([])
        } else {
            console.error("Failed to fetch grade", err.message)
        }
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchGrade(term)
  }, [term])

  // Helper: Calculate Term Average
  const averageScore = grades.length > 0 
    ? (grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length).toFixed(1)
    : 0

  // Helper: Color coding for grades
  const getGradeStyle = (grade: string) => {
    const g = grade.toUpperCase()
    if (g.startsWith('A')) return 'bg-green-100 text-green-700 border-green-200'
    if (g.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (g.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (g.startsWith('D')) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <section className='w-full max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8'>
      
      {/* --- Header Section --- */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-gray-800 tracking-tight'>My Academic Results</h1>
          <p className='text-gray-500 text-sm'>Track your performance and progress across terms.</p>
        </div>

        <div className='bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 w-full md:w-auto'>
            {[1, 2, 3].map((t) => (
                <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`flex-1 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        term === t 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Term {t}
                </button>
            ))}
        </div>
      </div>

      {!loading && grades.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100 flex items-center gap-4'>
                <div className='bg-white/20 p-3 rounded-2xl'>
                    <FaAward size={24} />
                </div>
                <div>
                    <p className='text-blue-100 text-xs font-bold uppercase tracking-wider'>Term Average</p>
                    <h3 className='text-3xl font-black'>{averageScore}%</h3>
                </div>
            </div>
        </div>
      )}

      {loading ? (
          <div className='space-y-4 animate-pulse'>
              {[1, 2, 3, 4].map(i => (
                  <div key={i} className='h-20 bg-gray-100 rounded-2xl w-full'></div>
              ))}
          </div>
      ) : grades.length > 0 ? (
          <>
            <div className='hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest'>Subject</th>
                            <th className='px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest'>Score</th>
                            <th className='px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest'>Grade</th>
                            <th className='px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest'>Teacher</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {grades.map((item, index) => (
                            <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                                <td className='px-8 py-5 font-bold text-gray-800'>{item.subject}</td>
                                <td className='px-8 py-5 text-gray-600 font-mono font-bold'>{item.score}/100</td>
                                <td className='px-8 py-5'>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-black border ${getGradeStyle(item.grade)}`}>
                                        {item.grade}
                                    </span>
                                </td>
                                <td className='px-8 py-5 text-gray-500 text-sm'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold'>
                                            {item.teacher[0]}
                                        </div>
                                        {item.teacher}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='md:hidden flex flex-col gap-4'>
                {grades.map((item, index) => (
                    <div key={index} className='bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center'>
                        <div className='space-y-2 min-w-0'>
                            <h3 className='font-bold text-gray-800 text-lg truncate'>{item.subject}</h3>
                            <div className='flex items-center gap-2 text-gray-400 text-xs'>
                                <FaChalkboardTeacher />
                                <span className='truncate'>{item.teacher}</span>
                            </div>
                        </div>
                        <div className='flex flex-col items-end gap-1'>
                            <span className={`px-3 py-1 rounded-xl text-sm font-black border ${getGradeStyle(item.grade)}`}>
                                {item.grade}
                            </span>
                            <span className='text-xs font-bold text-gray-400'>{item.score}%</span>
                        </div>
                    </div>
                ))}
            </div>
          </>
      ) : (
          // --- Empty State ---
          <div className='bg-gray-50 rounded-[2.5rem] py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-center px-6'>
              <div className='w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 mb-4'>
                  <FaClipboardCheck size={40} />
              </div>
              <h3 className='text-xl font-bold text-gray-700'>No results posted</h3>
              <p className='text-sm text-gray-400 mt-2 max-w-xs mx-auto'>
                  Grades for Term {term} have not been published by your teachers yet.
              </p>
          </div>
      )}

      {/* Footer Note */}
      <div className='bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100/50'>
          <FaExclamationCircle className='text-blue-400 mt-0.5' />
          <p className='text-[11px] text-blue-600 leading-relaxed uppercase font-bold tracking-tight'>
              Official records only. If you notice any discrepancy in your scores, please contact the academic office immediately.
          </p>
      </div>

    </section>
  )
}

export default StudentGradesPage