import React from 'react'
import { FaUser, FaGraduationCap, FaPhone, FaSave, FaTimes } from 'react-icons/fa'

const RegisterStudentPage = () => {
  return (
    <section className='w-full max-w-4xl mx-auto'>
        
        <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-800'>Register New Student</h1>
            <p className='text-gray-500 mt-1'>Enter the student's details, academic placement, and parent contacts to create a new profile.</p>
        </div>

        <form className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            
            <div className='h-1.5 w-full bg-blue-600'></div>

            <div className='p-8 space-y-8'>
                
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaUser className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Student Identity</h2>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* First Name */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>First Name</label>
                            <input 
                                type="text" 
                                placeholder='e.g. John'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Last Name</label>
                            <input 
                                type="text" 
                                placeholder='e.g. Doe'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                            <input 
                                type="date" 
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-600'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Gender</label>
                            <select className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                        <FaGraduationCap className='text-blue-600' />
                        <h2 className='text-lg font-semibold text-gray-800'>Academic Details</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Grade */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Grade Level</label>
                            <select className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'>
                                <option value="">Select Grade</option>
                                <option value="9">Grade 9</option>
                                <option value="10">Grade 10</option>
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </select>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Section</label>
                            <select className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-gray-600'>
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
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
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
                                placeholder='Enter name'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700'>Guardian Phone</label>
                            <input 
                                type="tel" 
                                placeholder='Enter phone number'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                        <div className='space-y-2 md:col-span-2'>
                            <label className='text-sm font-medium text-gray-700'>Guardian Email</label>
                            <input 
                                type="email" 
                                placeholder='parent@example.com'
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>
                    </div>
                </div>

                <div className='pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end gap-3'>
                    <button 
                        type="button"
                        className='px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit"
                        className='px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2'
                    >
                        <FaSave /> Register Student
                    </button>
                </div>

            </div>
        </form>
    </section>
  )
}

export default RegisterStudentPage