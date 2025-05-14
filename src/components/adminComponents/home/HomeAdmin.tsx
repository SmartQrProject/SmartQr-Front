import React from 'react'

const Home = () => {
  return (
    <div className='m-6'>
      <h1>Hi, Owner!</h1>
      <h2>Today's summary</h2>
      <div className='grid grid-cols-2 gap-4 mt-6 h-40 '>
        <div className='border-2 border-gray-300 p-4 rounded-2xl '>
          <h3 className='text-lg font-semibold'>Sales</h3>
        </div>

        <div className='border-2 border-gray-300 p-4 rounded-2xl '>
          <h3 className='text-lg font-semibold '>Orders</h3>
        </div>
      </div>

           
    </div>
  )
}

export default Home