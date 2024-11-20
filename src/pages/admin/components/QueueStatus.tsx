import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'



const QueueStatusMember = ({ queueMembers }) => {
  console.log(queueMembers)
  return (
    <div>
      <div className='p-3 w-full'>
        <div>
          Coming Soon
        </div>
      </div>
    </div>
  )
}

export default QueueStatusMember
