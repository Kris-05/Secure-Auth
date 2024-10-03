import React from 'react'

const Input = ({icon:Icon, ...props}) => {
    // since icon is a html element already, Icon has been renamed
  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        {/* <icon /> */}
        <Icon className="w-5 h-5 text-green-500" />
      </div>
      <input
        {...props}
        className='w-full pl-10 pr-3 py-2 rounded-lg text-white placeholder-gray-400 transition duration-200
          bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500'
      >
      </input>
    </div>
  )
}

export default Input
