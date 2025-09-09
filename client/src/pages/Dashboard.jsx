import React, { useState, useEffect } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'

const Dashboard = () => {

  const [creations,setCreations] = useState([])

  const getDashboardData = async()=>{
    setCreations(dummyPublishedCreationData)
  }
 

  useEffect(()=>{
    getDashboardData()
  },[])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className="flex justify-start gap-4 flex-wrap"> 
          {/* total creation cards*/}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>

          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <p className='text-xl font-semibold'>{creations.length}</p>
          </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
              
              <Sparkles className='w-8 h-8 text-white' />
          </div>
        </div>


        {/* total Plan card*/}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>

          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>Free</h2>
          </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#0BB0D7] text-white flex justify-center items-center'>
              
              <Gem className='w-8 h-8 text-white' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard