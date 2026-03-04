'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addClass } from '@/services/class.service'
import { getAllTeachers } from '@/services/teacher.service'
import { TeacherProps } from '@/interface'
import { FaLayerGroup, FaChalkboardTeacher, FaSave, FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'

const gradeOptions = [
    { id: '9', name: 'Grade 9' },
    { id: '10', name: 'Grade 10' },
    { id: '11', name: 'Grade 11' },
    { id: '12', name: 'Grade 12' },
]

const AddClassPage = () => {
  const router = useRouter()
  
  const [name, setName] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [teacherId, setTeacherId] = useState<string>('')
  
  const [teachers, setTeachers] = useState<TeacherProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTeachers = async () => {
        try {
            const res = await getAllTeachers()
            setTeachers(res.data.data || [])
        } catch (err: any) {
            if(err.response && err.response.status === 404) {
                setTeachers([])
            } else {
                console.error("Failed to load teachers ", err)
            }
        }
    }
    fetchTeachers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name || !grade) {
        setError("Class Name and Grade are required.")
        setLoading(false)
        return
    }

    try {
        await addClass({ name, grade, teacherId })
        router.push('/admin/classes')
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to create class.")
    } finally {
        setLoading(false)
    }
  } 

  const selectedGradeObj = gradeOptions.find(g => g.id === grade);
  const selectedTeacherObj = teachers.find(t => t.id === teacherId);

  return (
    <section className='w-full max-w-2xl mx-auto p-4 md:p-8'>
        
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-textPrimary'>Create New Class</h1>
            <p className='text-textSecondary mt-1'>Assign a name, grade level, and class teacher to create a new section.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white p-8 rounded-2xl shadow-sm border border-borderColor space-y-6'>
            
            <div className='space-y-2'>
                <label className='text-sm font-medium text-textPrimary'>Class Name</label>
                <div className="relative">
                    <FaLayerGroup className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                    <input 
                        type="text" 
                        placeholder='e.g. Grade 10 A'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                    />
                </div>
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium text-textPrimary'>Grade Level</label>
                <Listbox value={grade} onChange={setGrade}>
                    <div className="relative">
                        <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                            <span className={`block truncate ${grade ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                {selectedGradeObj ? selectedGradeObj.name : "Select Grade"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {gradeOptions.map((g) => (
                                    <ListboxOption
                                        key={g.id}
                                        value={g.id}
                                        className={({ focus }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                                focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{g.name}</span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-mutedOrange">
                                                        <FaCheck className="h-3 w-3" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium text-textPrimary'>Assign Teacher (Optional)</label>
                <Listbox value={teacherId} onChange={setTeacherId}>
                    <div className="relative">
                        <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-10 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                            <span className="absolute left-4 top-3.5 text-textSecondary opacity-50">
                                <FaChalkboardTeacher />
                            </span>
                            <span className={`block truncate ${teacherId ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                {selectedTeacherObj ? `${selectedTeacherObj.name} ${selectedTeacherObj.subject_name ? `(${selectedTeacherObj.subject_name})` : ''}` : "Select a Class Teacher"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                <ListboxOption
                                    value=""
                                    className={({ focus }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                            focus ? 'bg-lightOrange text-mutedOrange' : 'text-textSecondary'
                                        }`
                                    }
                                >
                                    None
                                </ListboxOption>
                                {teachers.map((teacher) => (
                                    <ListboxOption
                                        key={teacher.id}
                                        value={teacher.id}
                                        className={({ focus }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                                focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {teacher.name} {teacher.subject_name ? `(${teacher.subject_name})` : ''}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-mutedOrange">
                                                        <FaCheck className="h-3 w-3" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            <div className='pt-6 border-t border-borderColor flex flex-col-reverse md:flex-row justify-end gap-3'>
                <button 
                    type="button"
                    onClick={() => router.back()}
                    className='px-6 py-2.5 rounded-lg border border-borderColor text-textSecondary font-medium hover:bg-backgroundBase transition-colors flex items-center justify-center gap-2'
                >
                    <FaTimes /> Cancel
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg bg-mutedOrange text-white font-medium hover:opacity-90 shadow-lg shadow-mutedOrange/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating...' : <><FaSave /> Create Class</>}
                </button>
            </div>

        </form>
    </section>
  )
}

export default AddClassPage