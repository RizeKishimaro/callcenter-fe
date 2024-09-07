import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { RefreshCcw } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Progress } from '../ui/progress'

type Props = {}

const SipInfo = (props: Props) => {
  const [cpuPercentage, setCpuPercentage] = useState(0);
  const [memoryPercentage, setMemoryPercentage] = useState(0);
  const [diskSpacePercentage, setDiskSpacePercentage] = useState(0);
  const [message, setMessage] = useState()
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/sysinfo');

    eventSource.onmessage = function(event) {
      const { data } = JSON.parse(event.data);
      setCpuPercentage(data.cpu.average);
      setMemoryPercentage(data.memory.percentageUsed)
      setDiskSpacePercentage(data.disk.percentageUsed)
      setMessage(data);
    };

    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  const now = new Date();
  const timeNow = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const monthNow = now.toLocaleString('en-US', { month: 'long' });
  const dayNow = now.toLocaleString('en-US', { weekday: 'long' });
  const dateNow = now.getDate();
  const yearNow = now.getFullYear();
  return (
    <Card className='bg-dashboardSecondary dark:bg-dashboardSecondary-foreground text-black dark:text-white h-auto'>
      <CardHeader >
        <div className="flex flex-col md:flex-row h-full justify-between">
          <div className="flex-1 flex flex-col gap-y-3">
            <div className="flex space-x-2 items-center">
              <button className='px-8 py-1 bg-success rounded-full text-md font-semibold text-white hover:bg-success/75 transition-all ease-in-out'>Active</button>
              <RefreshCcw />
            </div>
            <h3 className='font-thin text-md'>Telecom: Atom</h3>
            <h2 className='font-light xl:text-3xl lg:text-xl text-md tracking-wider'>09 979 778 887</h2>
          </div>
          <div className="flex-1 flex flex-col gap-y-3">
            <h1 className='font-thin xl:text-5xl lg:text-2xl text-xl'>{timeNow}</h1>
            <h2 className='font-semibold text-3xl tracking-wider'>{monthNow}</h2>
            <h3 className='font-light text-xl tracking-wider'>{dayNow} {dateNow}th {yearNow}</h3>
          </div>
        </div>
      </CardHeader>
      <Separator className='my-5' />
      <CardContent className='mt-3 flex flex-row w-full' >
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-col gap-y-4">
            <div className="flex">
              <p className='w-1/3'>CPU</p>
              <Progress value={cpuPercentage} className='w-[100%]' />
            </div>
            <div className="flex">
              <p className='w-1/3'>Memory</p>
              <Progress value={memoryPercentage} className="w-full" />
            </div>
            <div className="flex">
              <p className='w-1/3'>Storage</p>
              <Progress value={diskSpacePercentage} className='w-[100%]' />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex-row justify-between w-full flex items-start'>
        <div className='h-full w-1/2 text-start'>
          <div>
            {
              message && message.cpu.individual.map((el, index) => {
                return (
                  <div>
                    <p>Core {index}: {Math.floor(el.usage)}%</p>
                  </div>

                )
              })
            }


          </div>
        </div>

        <div>
          <div>
            <p>CPU: {cpuPercentage && Math.floor(cpuPercentage)}%</p>
          </div>
          <div>
            <p>RAM: {memoryPercentage && Math.floor(memoryPercentage)}%</p>
          </div>

          <div>
            <p>Storage: {diskSpacePercentage && Math.floor(diskSpacePercentage)}%</p>
          </div>

        </div>

      </CardFooter>
    </Card>
  )
}
export default SipInfo
