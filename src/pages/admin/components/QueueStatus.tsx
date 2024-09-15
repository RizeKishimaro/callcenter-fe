import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'

const fakeUsers = [
  {
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=5", // Placeholder avatar image
  },
  {
    name: "Bob Smith",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Charlie Williams",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Dana Brown",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Ethan Davis",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=5", // Placeholder avatar image
  },
  {
    name: "Bob Smith",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Charlie Williams",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Dana Brown",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Ethan Davis",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=5", // Placeholder avatar image
  },
  {
    name: "Bob Smith",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Charlie Williams",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Dana Brown",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Ethan Davis",
    image: "https://i.pravatar.cc/150?img=5",
  },
];


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
