import { Models } from 'appwrite'
import { Button } from '../button'
import { checkStringLength } from '@/lib/utils'


type userCardProps={
    user : Models.Document
}


const UserCard = ({user} : userCardProps) => {

  
    
  return (
    <div className='flex flex-col m-0 justify-evenly py-2 items-center font-semibold capitalize w-full h-[200px]   bg-dark-2 rounded-3xl border border-dark-4  '>
        <img src={user.imageUrl} alt="profile" className='h-12 w-12 rounded-full' />
        <div>{user.username}</div>
        <div className='text-light-3'>{`Followed by `+checkStringLength("khaled_22")}</div>
        <Button className='shad-button_primary whitespace-nowrap px-4 rounded-md  text-lg  capitalize'>
            follow</Button>
    </div>
  )
}

export default UserCard