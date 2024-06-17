import Loader from "@/components/ui/shared/Loader"
import UserCard from "@/components/ui/shared/UserCard"
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"


const AllUsers = () => {


  const {data:users,isPending:isFetchingPost,hasNextPage,fetchNextPage}=useGetAllUsers()

    const {inView,ref}=useInView()

  useEffect(()=>{
    if(hasNextPage)  fetchNextPage()
  },[inView])

  const renderdUsers=users?.pages.flatMap(
          item => item.documents.map(
            (user:Models.Document)=>(<UserCard key={user.$id} user={user}/>)
          )
  )

  return (
    <div className="  w-full ">
      <div className="flex justify-start items-center gap-2 pt-14 px-14">
        <img src="/assets/images/all_users.png" 
            alt="people_icon"             
            width={35}
            height={35}
            className="" />
      <h2 className="h3-bold md:h2-bold">All Users</h2>
       
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-14 lg:gap-16">
                  {renderdUsers}
      </div>
{  hasNextPage &&    <div ref={ref} className="mt-10 ">
        
        <Loader/>
      </div>}
    </div>
  )
}

export default AllUsers