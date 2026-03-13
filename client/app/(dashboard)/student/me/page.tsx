'use client'
import { StudentProfileInterface } from '@/interface'
import { getStudentProfile } from '@/services/student.service'
import { formatDate } from '@/utils/formatTime' 
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaIdBadge, FaLock, FaShieldAlt, FaUser, FaMapMarkerAlt, FaBirthdayCake, FaPhone, FaUsers } from 'react-icons/fa'

const StudentProfilePage = () => {
  const [profileData, setProfileData] = useState<StudentProfileInterface | null>(null)
  const [loading, setLoading] = useState(true)

  const getProfile = async () => {
    try {
        setLoading(true)
        const res = await getStudentProfile()
        const data = res.data.data
        setProfileData(data)
    } catch (error) {
        console.error("Error fetching profile:", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  console.log(profileData)

  const fullName = profileData ? `${profileData.studentfirstname} ${profileData.studentlastname}` : ''
  const initials = profileData ? `${profileData.studentfirstname?.[0]}${profileData.studentlastname?.[0]}` : 'U'

  if (loading) {
    return (
        <div className="w-full max-w-5xl mx-auto p-6 md:p-8 animate-pulse space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
        </div>
    )
  }

  return (
    <section className='w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8'>
        
        <div>
            <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
            <p className='text-gray-500 text-sm mt-1'>Manage your account settings and academic information.</p>
        </div>

        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
            
            <div className='h-32 md:h-40 bg-linear-to-r from-mutedOrange to-lightOrange opacity-20 relative'>
            </div>

            <div className='px-6 mt-4 md:px-10 pb-8'>
                
                <div className='flex flex-col relative z-10 md:flex-row items-center md:items-end -mt-16 md:-mt-20 gap-6 mb-6'>
                    
                    <div className='w-28 h-28 md:w-36 md:h-36 rounded-full bg-white p-1.5 shadow-xl'>
                        <div className='w-full h-full rounded-full bg-mutedOrange flex items-center justify-center text-white text-3xl md:text-5xl font-bold uppercase'>
                            {initials}
                        </div>
                    </div>

                    <div className='flex-1 text-center md:text-left mb-2'>
                        <h2 className='text-2xl md:text-4xl font-bold text-gray-900'>{fullName}</h2>
                        <div className='flex items-center justify-center md:justify-start gap-3 mt-3'>
                            <span className='px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-lightCharcoal text-white'>
                                Student
                            </span>
                            <span className='text-gray-500 font-medium text-sm flex items-center gap-1.5'>
                                <FaIdBadge className="text-mutedOrange" /> {profileData?.class || "Unassigned"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='h-px bg-gray-100 w-full my-8'></div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    
                    <div className='lg:col-span-2 space-y-8'>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2 mb-6'>
                                <FaUser className='text-mutedOrange' /> Personal Information
                            </h3>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <DetailBox label="Full Name" value={fullName} icon={<FaUser />} />
                                <DetailBox label="Email Address" value={profileData?.studentemail} icon={<FaEnvelope />} />
                                <DetailBox label="Date of Birth" value={profileData?.studentdob ? formatDate(profileData.studentdob) : 'N/A'} icon={<FaBirthdayCake />} />
                                <DetailBox label="Gender" value={profileData?.studentgender} icon={<FaUsers />} />
                                <div className="md:col-span-2">
                                    <DetailBox label="Residential Address" value={profileData?.studentaddress} icon={<FaMapMarkerAlt />} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2 mb-6'>
                                <FaUsers className='text-mutedOrange' /> Parent / Guardian Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <DetailBox label="Guardian Name" value={profileData?.parentname} />
                                <DetailBox label="Guardian Phone" value={profileData?.parentphone} icon={<FaPhone />} />
                                <div className="md:col-span-2">
                                    <DetailBox label="Guardian Email" value={profileData?.parentemail} icon={<FaEnvelope />} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                            <FaShieldAlt className='text-mutedOrange' /> Security
                        </h3>

                        <div className='bg-gray-50 border border-gray-100 rounded-2xl p-6'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-white p-3 rounded-xl shadow-sm text-mutedOrange'>
                                    <FaLock />
                                </div>
                                <div>
                                    <h4 className='font-bold text-gray-800 text-sm'>Account Password</h4>
                                    <p className='text-xs text-gray-500 mt-1 leading-relaxed'>
                                        Update your password regularly to keep your student account secure.
                                    </p>
                                    <Link 
                                        href="/change-password" 
                                        className='inline-flex items-center mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-mutedOrange hover:bg-mutedOrange hover:text-white transition-all'
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {profileData?.joined && (
                             <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <p className="text-xs font-bold text-orange-400 uppercase">Joined ON</p>
                                <p className="text-sm font-bold text-orange-900">{formatDate(profileData.joined)}</p>
                             </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </section>
  )
}

// Helper Component for Data Rows
const DetailBox = ({ label, value, icon }: { label: string, value?: string | null, icon?: React.ReactNode }) => (
    <div className='bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-1'>
        <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5'>
            {icon && <span className="text-gray-300">{icon}</span>}
            {label}
        </label>
        <p className='font-semibold text-gray-800 truncate'>{value || "Not Provided"}</p>
    </div>
)

export default StudentProfilePage;