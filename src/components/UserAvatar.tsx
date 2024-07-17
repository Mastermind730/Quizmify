import { User } from 'next-auth';
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';

interface UserAvatarProps {
    user: Pick<User, "name" | "image" >;
  }

const UserAvatar:React.FC<UserAvatarProps> = ({user}) => {
    // console.log(user)
  return (
    <Avatar>
        {user.image?(
            <div className='relative w-full h-full aspect-square'>
<Image src={user.image} alt='profile' fill referrerPolicy='no-referrer'/>
            </div>
        ):(<AvatarFallback>
            <span className='sr-only'>{user?.name}</span>
        </AvatarFallback>)}
    </Avatar>
  )
}

export default UserAvatar