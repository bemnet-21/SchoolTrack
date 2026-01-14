'use client'

import { getClassId } from '@/services/class.service'
import { registerStudent } from '@/services/student.service'
import React, { useEffect, useState } from 'react'
import { FaUser, FaGraduationCap, FaPhone, FaSave, FaTimes, FaCheckCircle, FaCopy } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { RegistrationSuccessData } from '@/interface'

const RegisterStudentPage = () => {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [studentEmail, setStudentEmail] = useState<string>('') 
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  
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
        parentEmail: parentEmail
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
            <h1 className='text-4xl font-bold text-gray-800'>Register New Student</h1>
            <p className='text-gray-500 mt-1'>Enter the student details, academic placement, and parent contacts.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <FaTimes />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            
            <div className='h-1.5 w-full bg-blue-600'></div>

            <div className='p-8 space-y-8'>
                
                {/*  1. Student Identity  */}
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
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                            <input 
                                type="date" 
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
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
                    </div>
                </div>

                {/*  2. Academic Details  */}
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaGraduationCap className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Academic Details</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Grade Level</label>
                            <select 
                                required
                                value={grade}
                                onChange={(e) => setGrade(Number(e.target.value))}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'
                            >
                                <option value={0}>Select Grade</option>
                                <option value={9}>Grade 9</option>
                                <option value={10}>Grade 10</option>
                                <option value={11}>Grade 11</option>
                                <option value={12}>Grade 12</option>
                            </select>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Section</label>
                            <select 
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'
                            >
                                <option value="">Select Section</option>
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                            </select>
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Student Email (Optional)</label>
                            <input 
                                type="email" 
                                placeholder='student@school.com'
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                {/*  3. Parent/Guardian  */}
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

                {/*  Footer Buttons  */}
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
                        disabled={loading}
                        className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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