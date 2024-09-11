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

const UserAvatar = ({ name, image }) => {
  return (
    <div className="flex items-center w-full justify-between overflow-scroll">
      <div className='flex items-center'>
        <Avatar className='rounded-full w-[55px] overflow-hidden'>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className='text-start ml-5'>
          <h2 className="text-start w-full font-semibold">{name}</h2>
        </div>

      </div>
    </div>
  );
};

const QueueStatusMember = () => {
  return (
    <div>
      <div className='p-3 w-full'>
        {fakeUsers.map((user, index) => (
          <UserAvatar key={index} name={user.name} image={user.image} />
        ))}
      </div>
    </div>
  )
}

export default QueueStatusMember
