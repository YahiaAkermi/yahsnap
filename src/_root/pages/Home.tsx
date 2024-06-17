import Loader from "@/components/ui/shared/Loader"
import PostCard from "@/components/ui/shared/PostCard"
import UserCard from "@/components/ui/shared/UserCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAllUsers, useGetRecentPost } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"


const Home = () => {

 const {data:posts  ,isPending: isPostLoading ,hasNextPage,fetchNextPage}=useGetRecentPost()
 
 const {data:topCreators,isPending: isLoadingTopCreator} =useGetAllUsers()
 
 const { ref,inView }=useInView()



 const creators = topCreators?.pages.flatMap(item => 
  item.documents.map((user: Models.Document) => 
    <UserCard user={user} key={user.$id} />
  )
);


 useEffect(()=>{
  if(inView) fetchNextPage();
 },[inView])
 
 const creatorsSkeleton=["1","2"].map((index)=>(
  <div className="flex flex-col items-center gap-2" key={index}>
  <Skeleton className="h-12 w-12 rounded-full" />     
    <Skeleton className="h-4 w-[70px]" />
    <Skeleton className="h-4 w-[70px]" />
    <Skeleton className="h-6 w-[100px] mt-2" />   
  </div>
 ))
 
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
        {isPostLoading && !posts ? 
        (<div className="flex flex-col gap-3 w-full h-10">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
            </div>
         </div>)
        : (
          <ul className="flex flex-col flex-1 w-full">
            <div className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.map((item)=>(
                       item.documents.map((mypost: Models.Document)=>(
                        <PostCard post={mypost} key={mypost.$id} />
                       ))
                
              ))} 
            </div>
              {
                  hasNextPage &&
              <div ref={ref} className="mt-1 flex justify-center w-full">
                <Loader/>
              </div>
              }
          </ul>
        ) }
        </div>

      </div>
      <div className="home-creators"> 
          <h2 className="h3-bold md:h2-bold text-left w-full capitalize mt-4">top creator</h2>
            {    
            isLoadingTopCreator ?      
              <div className="flex flex-1 justify-around flex-wrap p-2 w-full">
                          { creatorsSkeleton }
              </div>
            : 
              <div className="w-full grid grid-cols-2 gap-4 ">
                {creators}
              </div>}
      </div>
    </div>
  )
}

export default Home