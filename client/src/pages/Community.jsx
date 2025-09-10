import React, { useState, useEffect } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import { useUser } from '@clerk/clerk-react' // adjust based on your auth

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 flex gap-2 items-end justify-end 
              group-hover:justify-between p-3 group-hover:bg-gradient-to-b 
              from-transparent to-black/80 text-white transition-all duration-200"
            >
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>

              <div className="flex gap-1 items-center">
                <p>{creation.likes?.length || 0}</p>
                <Heart
                  className={`min-w-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes?.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
