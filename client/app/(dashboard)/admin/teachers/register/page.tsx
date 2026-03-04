'use client'

import { SubjectProps, TeacherCredentials } from '@/interface'
import { getAllSubjects } from '@/services/subject.service'
import { addTeacher } from '@/services/teacher.service'
import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaTimes, FaCheckCircle, FaCopy, FaChevronDown, FaCheck } from 'react-icons/fa'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'

const AddTeacherPage = () => {
  const router = useRouter()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')
  
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdCredentials, setCreatedCredentials] = useState<TeacherCredentials | null>(null)

  const fetchSubjects = async () => {
      try {
          const res = await getAllSubjects()
          setSubjects(res.data.data || [])
      } catch (err) {
          console.error("Failed to load subjects", err)
      }
  }
  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
        const res = await addTeacher({ name, teacherEmail: email, teacherPhone: phone, subjectId })
        
        if (res.status === 201) {
            setCreatedCredentials(res.data.credentials)
        }
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to register teacher.")
    } finally {
        setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleClose = () => {
    setCreatedCredentials(null)
    router.push('/admin/teachers')
  }

  const selectedSubject = subjects.find(s => s.id === subjectId);

  return (
    <section className='w-full max-w-3xl mx-auto p-4 md:p-8 relative'>

        {createdCredentials && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-600 p-6 text-center">
                        <FaCheckCircle className="text-white text-5xl mx-auto mb-2" />
                        <h2 className="text-2xl font-bold text-white">Teacher Registered!</h2>
                        <p className="text-green-100">Please share these credentials with the teacher.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-backgroundBase p-4 rounded-xl border border-borderColor space-y-3">
                            <div>
                                <label className="text-xs font-bold text-textSecondary uppercase">Email</label>
                                <p className="font-medium text-textPrimary">{createdCredentials.email}</p>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-textSecondary uppercase">Temporary Password</label>
                                <div className="flex items-center justify-between bg-white p-3 rounded border border-borderColor mt-1">
                                    <span className="font-mono font-bold text-blue-600 tracking-wider">
                                        {createdCredentials.temporaryPassword}
                                    </span>
                                    <button 
                                        onClick={() => copyToClipboard(createdCredentials.temporaryPassword)}
                                        className="text-textSecondary hover:text-mutedOrange transition-colors"
                                        title="Copy"
                                    >
                                        <FaCopy />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleClose}
                            className="w-full bg-textPrimary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-colors"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-textPrimary'>Register New Teacher</h1>
            <p className='text-textSecondary mt-1'>Create a profile, assign a subject, and generate login credentials.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <FaTimes />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-borderColor overflow-hidden'>
            <div className='h-1.5 w-full bg-mutedOrange'></div>
            
            <div className='p-8 space-y-6'>
                
                {/* Name */}
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-textPrimary'>Full Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                        <input 
                            type="text" 
                            required
                            placeholder='e.g. Sarah Connor'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Email */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-textPrimary'>Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                            <input 
                                type="email" 
                                required
                                placeholder='teacher@school.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-textPrimary'>Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                            <input 
                                type="tel" 
                                required
                                placeholder='+1 234 567 890'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-textPrimary'>Assign Subject</label>
                    <Listbox value={subjectId} onChange={setSubjectId}>
                        <div className="relative">
                            <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-10 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                                <span className="absolute left-4 top-3.5 text-textSecondary opacity-50">
                                    <FaBook />
                                </span>
                                <span className={`block truncate ${selectedSubject ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                    {selectedSubject ? selectedSubject.name : "Select a Subject"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                                </span>
                            </ListboxButton>

                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {subjects.map((sub) => (
                                        <ListboxOption
                                            key={sub.id}
                                            value={sub.id}
                                            className={({ focus }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                                    focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {sub.name}
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

                {/* Buttons */}
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
                        className={`px-6 py-2.5 rounded-lg bg-mutedOrange text-white font-medium hover:opacity-90 shadow-lg shadow-mutedOrange/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : <><FaSave /> Register Teacher</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default AddTeacherPage