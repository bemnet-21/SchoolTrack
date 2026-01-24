'use client'

import { StudentDetail, ClassProps, StudentProps } from '@/interface'
import { getStudentProfile, updateStudentProfile } from '@/services/student.service'
import { getAllClasses } from '@/services/class.service' // To populate class dropdown
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaUser, FaGraduationCap, FaPhone, FaSave, FaTimes, FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaLayerGroup } from 'react-icons/fa'

const EditStudentPage = () => {
  const params = useParams()
  const router = useRouter()
  // Ensure we get a single string ID
  const studentId = Array.isArray(params?.id) ? params.id[0] : params?.id

  // --- Form States ---
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [dob, setDob] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [studentEmail, setStudentEmail] = useState<string>('') 
  const [address, setAddress] = useState<string>('') 
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  
  const [parentName, setParentName] = useState<string>('')
  const [parentEmail, setParentEmail] = useState<string>('')
  const [parentPhone, setParentPhone] = useState<string>('')

  // --- Data & UI States ---
  const [classes, setClasses] = useState<ClassProps[]>([]) // For class dropdown
  const [loading, setLoading] = useState(true) // For initial data fetch
  const [submitting, setSubmitting] = useState(false) // For form submission
  const [error, setError] = useState('')

  // 1. Fetch Student Data and Classes on Mount
  useEffect(() => {
    if (!studentId) return

    const fetchData = async () => {
        setLoading(true)
        try {
            const [studentRes, classesRes] = await Promise.all([
                getStudentProfile(studentId),
                getAllClasses()
            ])
            
            const studentData: StudentDetail = studentRes.data.data
            const classesData: ClassProps[] = classesRes.data.data || []

            setClasses(classesData)
            
            setFirstName(studentData.studentfirstname || '')
            setLastName(studentData.studentlastname || '')
            setDob(studentData.studentdob ? studentData.studentdob.split('T')[0] : '') 
            setGender(studentData.studentgender || '')
            setStudentEmail(studentData.studentemail || '') 
            setAddress(studentData.studentaddress || '')

            setParentName(studentData.parentname || '')
            setParentEmail(studentData.parentemail || '')
            setParentPhone(studentData.parentphone || '')

            const currentClass = classesData.find(c => c.name === studentData.class);
            setSelectedClassId(currentClass?.id || '')

        } catch (error) {
            console.error("Failed to fetch student or class data", error)
            setError("Failed to load student data. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    fetchData()
  }, [studentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!firstName || !lastName || !dob || !gender || !parentName || !parentEmail || !parentPhone) {
        setError("Please fill all required fields.")
        setSubmitting(false)
        return
    }

    if (!studentId) {
        setError("Invalid student ID.")
        setSubmitting(false)
        return
    }

    const payload: StudentProps = {
        studentFirstName: firstName,
        studentLastName: lastName,
        studentDob: dob,
        studentGender: gender,
        studentEmail: studentEmail, 
        classId: selectedClassId || null,
        parentName: parentName,
        parentEmail: parentEmail,
        parentPhone: parentPhone,
        studentAddress: address
    };

    try {
        await updateStudentProfile(studentId, payload)
        router.push(`/admin/students/${studentId}`) 
    } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || "Failed to update student profile.")
    } finally {
        setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className='w-full max-w-4xl mx-auto p-4 md:px-8 space-y-6 animate-pulse'>
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-10 bg-gray-100 rounded-lg md:col-span-2"></div>
            </div>
            <div className="h-12 w-full bg-blue-600 rounded-lg"></div>
        </div>
      </section>
    )
  }

  if (!studentId || (studentId && !firstName && !loading)) { 
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
            <h2 className="text-xl font-bold text-gray-800">Student Profile Not Found</h2>
            <p className="text-gray-500 mt-2">Could not load student data for editing.</p>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-2">
                Go Back
            </button>
        </div>
    )
  }

  return (
    <section className='w-full max-w-4xl mx-auto p-4 md:px-8 pt-6 md:pt-8'>
        
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Edit Student Profile</h1>
            <p className='text-gray-500 mt-1'>Update the student's personal, academic, and parent information.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm flex items-center justify-center md:justify-start gap-2">
                <FaTimes /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='h-1.5 w-full bg-blue-600'></div>
            
            <div className='p-8 space-y-8'>
                
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaUser className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Student Identity</h2>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>First Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder='e.g. John'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Last Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder='e.g. Doe'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                            <input 
                                type="date" 
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Gender</label>
                            <select 
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Address (Optional)</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder='123 Main St, Anytown'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaGraduationCap className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Academic Details</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Class Selector */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Assigned Class</label>
                            <div className="relative">
                                <FaLayerGroup className="absolute left-4 top-3.5 text-gray-400" />
                                <select 
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white appearance-none'
                                >
                                    <option value="">Select a Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} (Grade {cls.grade})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Student Email (Login)</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                                <input 
                                    type="email" 
                                    placeholder='student@school.com'
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaPhone className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Parent/Guardian Contacts</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Guardian Name</label> 
                            <input 
                                type="text" 
                                required
                                placeholder='Enter name'
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Guardian Phone</label>
                            <input 
                                type="tel" 
                                required
                                placeholder='Enter phone number'
                                value={parentPhone}
                                onChange={(e) => setParentPhone(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Guardian Email</label>
                            <input 
                                type="email" 
                                required
                                placeholder='parent@example.com'
                                value={parentEmail}
                                onChange={(e) => setParentEmail(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className='pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className='px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Updating...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default EditStudentPage