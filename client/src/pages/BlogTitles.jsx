import React, { useState } from 'react'
import { Edit, Hash, Sparkles } from 'lucide-react'
const BlogTitles = () => {

  const blogCategories =["General","Business","Technology","Health","Lifestyle",
    "Education","Travel","Food"
  ]

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
  const [input, setInput] = useState('')
  const [titles, setTitles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async(e)=>{
      e.preventDefault();
     
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4
    text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 h-6 text-[#8E37EB]'/>
            <h1 className='text-xl font-semibold'>AI Title Generator</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>
            Keyword
          </p>
          <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} className='w-full px-3 mt-2 outline-none text-sm 
          rounded-md border border-gray-300' placeholder='The future of AI is....' required/>
          <p className='mt-4 text-sm font-medium'>
              Category
          </p>
          <div className='mt-3 flex gap-3 flex-wrap'>
            {blogCategories.map((item, index) => (
              <span
                onClick={() => setSelectedCategory(item)}
                key={index}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                  selectedCategory === item ? 'bg-purple-50 text-purple-700 ' : 'text-gray-500 border-gray-300'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <br/>
          <button type='submit' className='w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6
          text-sm rounded-lg cursor-pointer'>
            <Hash className='w-5'/>
            Generate Title
          </button>
      </form>
        <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
        border-gray-300 min-h-96'>
          <div className='flex items-center gap-3'>
            <Edit className='w-5 h-5 text-[#8E37EB]'/>
            <h1 className='text-xl font-semibold'>Generated Titles</h1>
         </div>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-9 h-9'/>
              <p>Enter a topic and click "Generate title" to get started</p>
            </div>

        </div>
    </div>
  )
}

export default BlogTitles