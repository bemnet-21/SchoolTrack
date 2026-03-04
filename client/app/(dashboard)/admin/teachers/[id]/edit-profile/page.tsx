'use client'

import { SubjectProps } from '@/interface'
import { getTeacherById, updateTeacherProfile } from '@/services/teacher.service'
import { getAllSubjects } from '@/services/subject.service'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaArrowLeft, FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'

const EditTeacherPage = () => {
  const params = useParams()
  const router = useRouter()
  const teacherId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [name, setName] = useState<string>('')
  const [teacherEmail, setTeacherEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')

  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!teacherId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [teacherRes, subjectRes] = await Promise.all([
          getTeacherById(teacherId),
          getAllSubjects()
        ])

        const teacherData = teacherRes.data.data
        const subjectData = subjectRes.data.data

        setName(teacherData.teachername || '')
        setTeacherEmail(teacherData.teacheremail || '')
        setPhone(teacherData.teacherphone || '')
        
        const matchingSub = subjectData.find((s: any) => s.name === teacherData.subject || s.id === teacherData.subject_id)
        setSubjectId(matchingSub ? matchingSub.id : '')

        setSubjects(subjectData || [])
      } catch (err: any) {
        console.error("Error fetching data", err)
        setError("Failed to load teacher details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teacherId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId) return

    setSaving(true)
    setError('')

    const payload = {
      name,
      teacherEmail, 
      phone, 
      subjectId
    }

    try {
      await updateTeacherProfile(teacherId, payload)
      router.push(`/admin/teachers/${teacherId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  const selectedSubject = subjects.find(s => s.id === subjectId)

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-borderColor rounded-lg" />
        <div className="h-8 w-64 bg-borderColor rounded-lg" />
        <div className="bg-white p-8 rounded-2xl border border-borderColor space-y-6">
            <div className="h-12 bg-backgroundBase rounded-lg w-full" />
            <div className="h-12 bg-backgroundBase rounded-lg w-full" />
            <div className="h-12 bg-backgroundBase rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <section className='w-full max-w-3xl mx-auto p-4 md:p-8 space-y-6'>
        
        <button 
            onClick={() => router.back()} 
            className='flex items-center gap-2 text-textSecondary hover:text-mutedOrange transition-colors font-bold text-xs uppercase tracking-widest'
        >
            <FaArrowLeft /> Cancel & Go Back
        </button>

        <div>
            <h1 className='text-3xl font-bold text-textPrimary tracking-tight'>Edit Teacher Profile</h1>
            <p className='text-textSecondary text-sm mt-1'>Update personal details and subject assignment.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-borderColor'>
            <div className='space-y-6'>
                
                <div className='space-y-2'>
                    <label className='text-xs font-bold text-textSecondary uppercase tracking-wider ml-1'>Full Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 rounded-xl border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all text-textPrimary'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-textSecondary uppercase tracking-wider ml-1'>Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                            <input 
                                type="email" 
                                required
                                value={teacherEmail}
                                onChange={(e) => setTeacherEmail(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-xl border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all text-textPrimary'
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-textSecondary uppercase tracking-wider ml-1'>Phone</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-3.5 text-textSecondary opacity-50" />
                            <input 
                                type="tel" 
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 rounded-xl border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all text-textPrimary'
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <label className='text-xs font-bold text-textSecondary uppercase tracking-wider ml-1'>Assigned Subject</label>
                    <Listbox value={subjectId} onChange={setSubjectId}>
                        <div className="relative">
                            <ListboxButton className="relative w-full cursor-default rounded-xl bg-white py-3 pl-10 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
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

                <div className='h-px bg-borderColor w-full my-2' />

                <div className='flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-3 rounded-xl border border-borderColor text-textSecondary font-bold hover:bg-backgroundBase transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className={`px-8 py-3 rounded-xl bg-mutedOrange text-white font-bold shadow-lg shadow-mutedOrange/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default EditTeacherPage