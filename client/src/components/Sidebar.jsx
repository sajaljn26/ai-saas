import React, { useState, useEffect } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { NavLink } from 'react-router-dom'
import { House, Hash, Image, Eraser, Scissors, FileText, Users, LogOut } from 'lucide-react'
import axios from 'axios'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: Hash },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-objects', label: 'Remove Objects', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, getToken } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const [userPlan, setUserPlan] = useState('Free Plan')

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data } = await axios.get('/api/user/get-user-plan', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
          setUserPlan(data.plan === 'premium' ? 'Premium Plan' : 'Free Plan')
        }
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    if (user) {
      fetchUserPlan()
    }
  }, [user, getToken])

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user?.imageUrl}
          alt="User avatar"
          className="w-12 h-12 rounded-full mx-auto object-cover"
        />
        <h1 className="mt-1 text-center text-sm font-medium text-gray-800">{user?.fullName || 'User'}</h1>
        <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : 'hover:bg-gray-100'}`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
        <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
            <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
                <img src={user?.imageUrl} alt="User avatar" className='w-8 h-8 rounded-full object-cover'/>
                <div>
                    <h1 className='text-sm font-medium text-gray-800'>{user?.fullName || 'User'}</h1>
                    <p className='text-xs text-gray-500'>{userPlan}</p>
                </div>
            </div>
            <LogOut onClick={signOut} className='w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer'/>

        </div>
    </div>
  )
}

export default Sidebar