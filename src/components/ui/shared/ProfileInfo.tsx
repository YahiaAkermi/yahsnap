import { useUserContext } from '@/context/AuthContext'
import { Button } from '../button'
import { useEffect, useState } from 'react'
import Stories from './Stories'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = ({creator}:any) => {

    

    const {user}=useUserContext()

    const [bioFound,setBioFound] =useState(false)

    const navigate=useNavigate()

   

   useEffect(()=>{
    if(creator?.bio){
        setBioFound(true)   
    }
   },[user])
   
   console.log(creator)

  return (
    <div className='w-full flex gap-5 lg:justify-center max-lg:flex-col max-lg:justify-center max-lg:items-center'>
        <div >
            <img src={creator?.imageUrl} 
            alt="profile" 
            height={100}
            width={100}
            className='rounded-full '
            />
        </div>
        <div className='flex flex-col w-full gap-9'>
            <div className='w-[60%] lg:w-[50%] flex lg:justify-between max-lg:flex-col-reverse max-lg:gap-4 max-lg:w-full items-center'>
                <div className='flex flex-col gap-2 max-lg:justify-center max-lg:items-center'>
                    <h2 className='text-light-1 text-2xl font-semibold'>{creator?.username}</h2>
                    <p className='text-light-3'>@{creator?.name}</p>
                </div>
                {
                    user.id !== creator?.$id 
                    ?
                    <div className='flex gap-3'>
                        <Button className='bg-primary-500 font-semibold'>Follow</Button>
                        <Button className='bg-light-2 text-dark-2 font-semibold'>Message</Button>
                    </div>
                    :

                        <Button className='bg-dark-4 font-semibold min-w-32 flex justify-center items-center gap-3 w-24'
                        onClick={()=>navigate('/update-profile/'+creator.id)}>
                            
                            <img src="/assets/icons/edit2.svg" alt="" />
                            Edit
                        </Button>                   
                }
            </div>
            <div className='flex  font-medium text-lg items-center gap-9 max-lg:justify-center'>
                   <p className='flex justify-between items-center gap-2'><span className='text-primary-600 '>{creator?.posts.length}</span>Posts</p>
                   <p className='flex justify-between items-center gap-2'><span className='text-primary-600 '>230K</span>Followers</p>
                   <p className='flex justify-between items-center gap-2'><span className='text-primary-600 '>86</span>Posts</p>
            </div>
            <div className='w-[60%]  max-md:w-[70%] max-lg:px-3'>
                {!bioFound ? 
                `AI Enthusiast | 📚 Master's Student in Computer Science | 🖥️ Backend Developer | 🚀 Tech Innovator | 💡 Always Learning | 📸 Capturing Moments | 📍 Remote`
                : creator?.bio
                }
            </div>
            <div className='w-full '>
                <Stories/>
            </div>
            
        </div>
    </div>
  )
}

export default ProfileInfo