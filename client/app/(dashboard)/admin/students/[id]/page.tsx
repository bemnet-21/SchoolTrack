'use client'

import { StudentDetail, TermCourseInteface } from '@/interface';
import { deleteStudent, getStudentProfile, getTermCourse } from '@/services/student.service';
import { formatDate } from '@/utils/formatTime'; // Ensure you have this
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react'
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaArrowLeft, FaGraduationCap, FaMapMarkerAlt, FaEdit, FaTrash, FaExclamationTriangle, FaChevronDown, FaCheck } from 'react-icons/fa'

const StudentProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  let id = params?.id
  const date = new Date()
  const currentYear = date.getFullYear()
  const terms = [1, 2, 3];
  const years = [...Array(5)].map((_, i) => currentYear - i);

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleting, setDeleting] = useState(false)
  const [termCourses, setTermCourses] = useState<TermCourseInteface[]>([])
  const [term, setTerm] = useState<number>(1)
  const [year, setYear] = useState<number>(currentYear)

  const getCourse = async (term: number, year: number, studentId?: string) => {
	const res = await getTermCourse(term, year, studentId)
	const data = res.data.data

	setTermCourses(data)
  }
  useEffect(() => {
	if(!id || Array.isArray(id)) id = ""
	getCourse(term, year, id)
  }, [term, year])
  console.log("Subjects", termCourses)
  

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const getStudent = async (studentId: string) => {
        try {
            setLoading(true)
            const res = await getStudentProfile(studentId)
            setStudent(res.data.data || res.data)
        } catch (error) {
            console.error("Failed to load student profile", error)
        } finally {
            setLoading(false)
        }
    }

    getStudent(id)
  }, [id])

  const handleRemove = async () => {
    if (!id || Array.isArray(id)) return
    setDeleting(true)
    try {
        await deleteStudent(id)
        router.push('/admin/students')
    } catch(err) {
        console.error("Failed to delete", err)
        alert("Failed to delete student, try again later")
        setDeleting(false)
        setShowDeleteModal(false)
    }
  }

  // --- Loading State ---
  if (loading) {
    return (
        <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
        </div>
    )
  }

  // --- Error State ---
  if (!student) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold text-gray-800">Student Not Found</h2>
            <button onClick={() => router.back()} className="text-mutedOrange hover:underline mt-2 cursor-pointer">
                Go Back
            </button>
        </div>
    )
  }

  return (
    <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8'>
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-gray-100">
                    <div className="p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg leading-6 font-bold text-gray-900">Remove Teacher?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Are you sure you want to remove <span className="font-bold text-gray-800">{`${student.studentfirstname} ${student.studentlastname}`}</span>? This action cannot be undone and will revoke their system access immediately.
                        </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={handleRemove}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-base font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 transition-all"
                        >
                            {deleting ? 'Removing...' : 'Yes, Remove'}
                        </button>
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={() => setShowDeleteModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
        <button 
            onClick={() => router.push('/admin/students/')} 
            className='flex items-center gap-2 text-gray-500 hover:text-mutedOrange transition-colors w-fit font-medium cursor-pointer'
        >
            <FaArrowLeft /> Back to Directory
        </button>

        <div className='bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden'>
            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-mutedOrange to-lightOrange opacity-30"></div>

            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-mutedOrange z-10'>
                {student.studentfirstname?.[0]}{student.studentlastname?.[0]}
            </div>

            <div className='flex-1 space-y-6 text-center md:text-left z-10 pt-2'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    {student.studentfirstname} {student.studentlastname}
                </h1>
                <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-3'>
                    <span className='px-3 py-1 bg-lightCharcoal text-white rounded-full text-sm font-semibold border border-blue-100'>
                        ID: {student.id}
                    </span>
                    <span className='px-3 py-1 bg-lightCharcoal text-white rounded-full text-sm font-semibold border border-indigo-100'>
                        {student.class || "Unassigned"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        student.studentgender.toLowerCase() === 'male' 
                        ? 'bg-lightCharcoal text-white' 
                        : 'bg-pink-50 text-pink-600 '
                    }`}>
                        {student.studentgender}
                    </span>
                </div>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-lightOrange p-2 rounded-lg text-mutedOrange">
                        <FaGraduationCap size={20} />
                    </div>
                    <h2 className='text-xl font-bold text-gray-800'>Academic & Personal</h2>
                </div>
                
                <div className='space-y-5'>
                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaBirthdayCake className="text-gray-400" />
                            <span className="font-medium text-sm">Date of Birth</span>
                        </div>
                        <span className="font-semibold text-gray-800">{formatDate(student.studentdob)}</span>
                    </div>

                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium text-sm">Grade Level</span>
                        </div>
                        <span className="font-semibold text-gray-800">{student.grade || "N/A"}</span>
                    </div>

                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaEnvelope className="text-gray-400" />
                            <span className="font-medium text-sm">Email</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-right max-w-50 truncate">
                            {student.studentemail || "Not Provided"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="font-medium text-sm">Address</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-right max-w-50 truncate">
                            {student.studentaddress || "Not Provided"}
                        </span>
                    </div>
                </div>
                <div className="w-full flex justify-between gap-x-12 pt-6 border-t border-gray-100 place-self-center">
                    <button 
                        className="flex-1 py-3 px-4 rounded-xl bg-mutedOrange text-white font-bold hover:bg-hoverMutedOrange transition-all text-sm shadow-lg shadow-lightOrange flex items-center justify-center gap-2 active:scale-95"
                        onClick={() => router.push(`/admin/students/${id}/edit-profile`)}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                    <button
                        className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                        onClick={() => setShowDeleteModal(true)} 
                    >
                        <FaTrash /> Remove
                    </button>
                </div>
            </div>

            <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                    <div className="bg-lightOrange p-2 rounded-lg text-mutedOrange">
                        <FaUser size={20} />
                    </div>
                    <h2 className='text-xl font-bold text-gray-800'>Parent / Guardian</h2>
                </div>

                <div className='space-y-5'>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</span>
                        <p className="text-lg font-semibold text-gray-800">{student.parentname}</p>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                            <FaPhone />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                            <p className="font-semibold text-gray-800">{student.parentphone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                            <FaEnvelope />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                            <p className="font-semibold text-gray-800 truncate">{student.parentemail}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* --- Academic Courses Section --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-lightOrange p-2 rounded-lg text-mutedOrange">
                        <FaGraduationCap size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Enrolled Courses</h2>
                </div>

                
				<div className="flex items-center gap-2">
            {/* Term Selector */}
					<div className="w-32">
						<Listbox value={term} onChange={setTerm}>
							<div className="relative">
								<ListboxButton className="relative w-full cursor-default rounded-xl bg-backgroundBase py-2.5 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm transition-all">
									<span className="block truncate text-textPrimary font-semibold">
										Term {term}
									</span>
									<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<FaChevronDown className="h-3 w-3 text-mutedOrange" aria-hidden="true" />
									</span>
								</ListboxButton>
								<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
									<ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
										{terms.map((t) => (
											<ListboxOption
												key={t}
												value={t}
												className={({ focus }) =>
													`relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
														focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
													}`
												}
											>
												{({ selected }) => (
													<>
														<span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
															Term {t}
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

					{/* Year Selector */}
					<div className="w-32">
						<Listbox value={year} onChange={setYear}>
							<div className="relative">
								<ListboxButton className="relative w-full cursor-default rounded-xl bg-backgroundBase py-2.5 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm transition-all">
									<span className="block truncate text-textPrimary font-semibold">
										{year}
									</span>
									<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
										<FaChevronDown className="h-3 w-3 text-mutedOrange" aria-hidden="true" />
									</span>
								</ListboxButton>
								<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
									<ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
										{years.map((y) => (
											<ListboxOption
												key={y}
												value={y}
												className={({ focus }) =>
													`relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
														focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
													}`
												}
											>
												{({ selected }) => (
													<>
														<span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
															{y}
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
				</div>
				{/*  */}
            </div>

            {termCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {termCourses.map((item, index) => (
                        <div 
                            key={index} 
                            className="group p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-lightOrange transition-all duration-200 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-mutedOrange shadow-sm group-hover:bg-mutedOrange group-hover:text-white transition-colors">
                                <span className="font-bold">{index + 1}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 group-hover:text-mutedOrange transition-colors">
                                    {item.subject}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-3xl">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <FaGraduationCap size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium text-center">No courses found for Term {term}, {year}</p>
                    <p className="text-sm text-gray-400 text-center">Contact administration to assign subjects.</p>
                </div>
            )}
        </div>

    </section>
  )
}

export default StudentProfilePage