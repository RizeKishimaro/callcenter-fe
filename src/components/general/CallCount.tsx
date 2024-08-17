import React from 'react'

type Props = {}

const CallCount = (props: Props) => {
  return (
    <div className='w-full h-[185px] bg-dashboardSecondary flex flex-col md:flex-row items-center justify-center rounded-md'>
        <div className="flex justify-between md:flex-row items-center flex-col  w-3/5 px-10">
            <div className="flex items-center justify-center flex-col">
                <h1 className='text-9xl'>5</h1>
                <h3 className='uppercase'>online calls</h3>
            </div>
            <div className="flex items-center justify-center flex-col">
                <h1 className='text-9xl'>9</h1>
                <h3 className='uppercase'>waiting calls</h3>
            </div>
            <div className="flex items-center justify-center flex-col">
                <h1 className='text-9xl'>99</h1>
                <h3 className='uppercase'>missing calls</h3>
            </div>
        </div>
        <div className="h-[80%] w-[1px] bg-black/50"></div>
        <div className="flex justify-between md:flex-row items-end flex-co w-2/5 h-full py-5">
            <div className="flex-1 flex items-center justify-center flex-col gap-y-2">
                <h1 className='text-5xl'>00:05</h1>
                <h3 className='uppercase flex flex-wrap w-[80%] text-center'>Average Waiting Time</h3>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col gap-y-2">
                <h1 className='text-5xl'>00:25</h1>
                <h3 className='uppercase flex flex-wrap w-[80%] text-center'>Longest Waiting Time</h3>
            </div>
        </div>
    </div>
  )
}

export default CallCount