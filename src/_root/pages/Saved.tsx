import GridPostListb from "@/components/ui/shared/GridPostListb"
import Loader from "@/components/ui/shared/Loader"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"



const Saved = () => {

      const {data:savedPosts,isFetching:fetchingSavedPosts,hasNextPage,fetchNextPage}=useGetSavedPosts()

     const {ref,inView}=useInView()

     useEffect(()=>{
       if(inView && hasNextPage) fetchNextPage
     },[inView])

    //  const listSavedPosts =savedPosts?.pages.flatMap(item => 
    //   item.documents.map((post: Models.Document) => 
    //     console.log(post)
    //   ))
      
  return (
    <div className="  w-full flex flex-col gap-4 overflow-scroll  md:p-14 custom-scrollbar ">
      <div className="flex justify-start items-center gap-2 pt-14 px-14">
        <img src="/assets/images/saved.png" 
            alt="saved_icon"             
            width={25}
            height={25}
            className="" />
      <h2 className="h3-bold md:h2-bold">Saved</h2>       
      </div>

      <div className="w-full px-14 ">
      <div className="flex flex-wrap gap-9 w-full ">
        { fetchingSavedPosts ?  
         
         <div className="w-full flex w-full gap-5">
            <div className="flex flex-col gap-2 opacity-60">
              <Skeleton className="h-[300px] w-[300px] rounded-md" /> 
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
             </div>
            </div>
            <div className="flex flex-col gap-2 opacity-50">
              <Skeleton className="h-[300px] w-[300px] rounded-md" /> 
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>        
         </div>

        : 
           savedPosts?.pages.flatMap((item,index)=>(
          <GridPostListb key={`page-${index}`} posts={item.documents} />
        )
           )
        }
      </div>
      <div ref={ref} className="flex justify-center items-center w-full ">
             {  hasNextPage && <Loader/> } 
      </div>
      </div>
      </div>
  )
}

export default Saved