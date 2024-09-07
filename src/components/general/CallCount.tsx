import React from 'react'

type Props = {}

const CallCount = (props: Props) => {
  return (
    <div className='w-full h-[185px] bg-dashboardSecondary text-black dark:bg-dashboardSecondary-foreground mb-3 dark:text-white flex flex-col lg:flex-row items-center justify-center rounded-md space-y-3'>
        <div className="flex justify-between md:flex-row items-center flex-col  w-3/5 px-10">
            <div className="flex items-center justify-center flex-col">
                <h1 className='xl:text-9xl lg:text-6xl text-3xl '>5</h1>
                <h3 className='uppercase text-xs md:text-sm lg:text-md'>online calls</h3>
            </div>
            <div className="flex items-center justify-center flex-col">
                <h1 className='xl:text-9xl lg:text-6xl text-3xl'>9</h1>
                <h3 className='uppercase text-xs md:text-sm lg:text-md'>waiting calls</h3>
            </div>
            <div className="flex items-center justify-center flex-col">
                <h1 className='xl:text-9xl lg:text-6xl text-3xl'>99</h1>
                <h3 className='uppercase text-xs md:text-sm lg:text-md'>missing calls</h3>
            </div>
        </div>
        <div className="lg:h-[80%] lg:w-[1px] h-5 w-[80%] bg-black/50"></div>
        <div className="flex justify-between md:flex-row items-end flex-col w-2/5 h-full py-5">
            <div className="flex-1 flex items-center justify-center flex-col gap-y-2">
                <h1 className='xl:text-4xl lg:text-2xl text-xl'>00:05</h1>
                <h3 className='uppercase flex flex-wrap font-light w-[80%] text-center text-xs md:text-sm lg:text-md'>Average Waiting Time</h3>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col gap-y-2">
                <h1 className='xl:text-4xl lg:text-2xl text-xl'>00:25</h1>
                <h3 className='uppercase flex flex-wrap font-light w-[80%] text-center text-xs md:text-sm lg:text-md'>Longest Waiting Time</h3>
            </div>
        </div>
    </div>
  )
}

export default CallCount