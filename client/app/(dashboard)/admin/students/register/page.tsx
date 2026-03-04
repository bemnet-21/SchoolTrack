'use client'

import { getClassId } from '@/services/class.service'
import { registerStudent } from '@/services/student.service'
import React, { Fragment, useEffect, useState } from 'react'
import { FaUser, FaGraduationCap, FaPhone, FaSave, FaTimes, FaCheckCircle, FaCopy, FaChevronDown, FaCheck } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { RegistrationSuccessData } from '@/interface'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'

const sections = [
  { id: 'A', name: 'Section A' },
  { id: 'B', name: 'Section B' },
  { id: 'C', name: 'Section C' },
]

const grades = [
    { id: 9, name: 'Grade 9' },
    { id: 10, name: 'Grade 10' },
    { id: 11, name: 'Grade 11' },
    { id: 12, name: 'Grade 12' },
]

const genders = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
]

const RegisterStudentPage = () => {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [studentEmail, setStudentEmail] = useState<string>('') 
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  
  const [grade, setGrade] = useState<number>(0)
  const [section, setSection] = useState<string>('') 
  const [classId, setClassId] = useState<string>('') 
  
  const [parentName, setParentName] = useState<string>('')
  const [parentPhone, setParentPhone] = useState<string>('')
  const [parentEmail, setParentEmail] = useState<string>('')

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<RegistrationSuccessData | null>(null);

  const getClassIdFromGrade = async (selectedGrade: number) => {
    if (selectedGrade > 0) {
        try {
            const res = await getClassId(selectedGrade.toString())
            const id = res.data.classId || res.data.data?.classId; 
            setClassId(id);
        } catch (error) {
            console.error("Error fetching class ID", error);
            setClassId('');
        }
    }
  }

  useEffect(() => {
    getClassIdFromGrade(grade)
  }, [grade])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = {
        studentFirstName: firstName,
        studentLastName: lastName,
        studentEmail: studentEmail,
        studentDob: dateOfBirth,
        studentGender: gender,
        classId: classId || null, 
        parentName: parentName,
        parentPhone: parentPhone,
        parentEmail: parentEmail,
        studentAddress: address
    };

    try {
        const res = await registerStudent(data);
        
        if(res.status === 201) {
            setCreatedCredentials(res.data.credentials);
        }

    } catch(err: any) {
        console.error(err);
        const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please check inputs.";
        setError(msg);
    } finally {
        setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleCloseSuccess = () => {
    setCreatedCredentials(null);
    router.push('/admin/students'); 
  };

  return (
    <section className='w-full max-w-4xl mx-auto p-4 md:px-8 relative'>
        
        {createdCredentials && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                    
                    <div className="bg-green-600 p-6 text-center">
                        <FaCheckCircle className="text-white text-5xl mx-auto mb-2" />
                        <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
                        <p className="text-green-100">Please save these temporary credentials.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Student Login</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{createdCredentials.student.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200 mt-1">
                                    <span className="text-gray-600">Password:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-blue-600">
                                            {createdCredentials.student.temporaryPassword}
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={() => copyToClipboard(createdCredentials.student.temporaryPassword || "")}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Copy Password"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Parent Login</h3>
                            {createdCredentials.parent.temporaryPassword ? (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{createdCredentials.parent.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200 mt-1">
                                        <span className="text-gray-600">Password:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-blue-600">
                                                {createdCredentials.parent.temporaryPassword}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => copyToClipboard(createdCredentials.parent.temporaryPassword || "")}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Copy Password"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    {"Parent account already exists."}
                                </p>
                            )}
                        </div>

                        <button 
                            type="button"
                            onClick={handleCloseSuccess}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-textPrimary'>Register New Student</h1>
            <p className='text-textSecondary mt-1'>Enter the student details, academic placement, and parent contacts.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <FaTimes />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-borderColor overflow-hidden'>
            
            <div className='h-1.5 w-full bg-mutedOrange'></div>

            <div className='p-8 space-y-8'>
                
                {/*  1. Student Identity  */}
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-borderColor'>
                        <FaUser className='text-mutedOrange' />
                        <h2 className='text-lg font-semibold text-textPrimary'>Student Identity</h2>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>First Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder='e.g. John'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Last Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder='e.g. Doe'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Date of Birth</label>
                            <input 
                                type="date" 
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all text-textSecondary'
                            />
                        </div>

                        {/* Gender Dropdown */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Gender</label>
                            <Listbox value={gender} onChange={setGender}>
                                <div className="relative">
                                    <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                                        <span className={`block truncate ${gender ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                            {gender || "Select Gender"}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                                        </span>
                                    </ListboxButton>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {genders.map((g) => (
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
                            <label className='text-sm font-medium text-textPrimary'>Address</label>
                            <input 
                                type="text" 
                                required
                                placeholder='e.g. Addis Ababa'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/*  2. Academic Details  */}
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-borderColor'>
                        <FaGraduationCap className='text-mutedOrange' />
                        <h2 className='text-lg font-semibold text-textPrimary'>Academic Details</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Grade Level Dropdown */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Grade Level</label>
                            <Listbox value={grade} onChange={setGrade}>
                                <div className="relative">
                                    <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                                        <span className={`block truncate ${grade > 0 ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                            {grade > 0 ? `Grade ${grade}` : "Select Grade"}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                                        </span>
                                    </ListboxButton>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {grades.map((g) => (
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

                        {/* Section Dropdown */}
                        <div className="w-full space-y-2">
                            <label className="text-sm font-medium text-textPrimary">Section</label>
                            <Listbox value={section} onChange={setSection}>
                                <div className="relative">
                                    <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-borderColor focus:outline-none focus:ring-2 focus:ring-mutedOrange sm:text-sm">
                                        <span className={`block truncate ${section ? 'text-textPrimary' : 'text-textSecondary'}`}>
                                            {section ? `Section ${section}` : "Select Section"}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <FaChevronDown className="h-4 w-4 text-mutedOrange" aria-hidden="true" />
                                        </span>
                                    </ListboxButton>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {sections.map((s) => (
                                                <ListboxOption
                                                    key={s.id}
                                                    value={s.id}
                                                    className={({ focus }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                                            focus ? 'bg-lightOrange text-mutedOrange' : 'text-textPrimary'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{s.name}</span>
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

                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-textPrimary'>Student Email</label>
                            <input 
                                type="email" 
                                placeholder='student@school.com'
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/*  3. Parent/Guardian  */}
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-borderColor'>
                        <FaPhone className='text-mutedOrange' />
                        <h2 className='text-lg font-semibold text-textPrimary'>Parent/Guardian Contacts</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Guardian Name</label> 
                            <input 
                                type="text" 
                                required
                                placeholder='Enter name'
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-textPrimary'>Guardian Phone</label>
                            <input 
                                type="tel" 
                                required
                                placeholder='Enter phone number'
                                value={parentPhone}
                                onChange={(e) => setParentPhone(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-textPrimary'>Guardian Email</label>
                            <input 
                                type="email" 
                                required
                                placeholder='parent@example.com'
                                value={parentEmail}
                                onChange={(e) => setParentEmail(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-borderColor focus:ring-2 focus:ring-lightOrange focus:border-mutedOrange outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/*  Footer Buttons  */}
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
                        {loading ? 'Registering...' : <><FaSave /> Register Student</>}
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default RegisterStudentPage