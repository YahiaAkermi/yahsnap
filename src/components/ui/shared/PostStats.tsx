
import { useGetCurrentUser, useLikePost, useSavePost, usedeleteSavedPost } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"

import { useEffect, useState } from "react"
import Loader from "./Loader"



type PostStatsProps={
  post: Models.Document,
  userId:string
}

const PostStats = ({post,userId} : PostStatsProps) => {

  const likesList=post.likes?.map((user:Models.Document)=> user.$id)

  const [likes, setlikes] = useState(likesList)
  const [isSaved,setIsSaved] = useState(false)

  //i declared our mutations
   const {mutate: likePost}=useLikePost()
   const {mutate: savePost,isPending:savingPost}=useSavePost()
   const {mutate: deleteSavedPost,isPending:deletingPost}=usedeleteSavedPost()

  //we need to know the currently logged in user
  const {data: currentUser}=useGetCurrentUser()

  const savedPostRecord= currentUser?.save.find((record:Models.Document)=>record.post.$id == post.$id)

  useEffect(()=>{
    setIsSaved(savedPostRecord ? true : false)
    //i could've  done it like this setIsSaved(!!savedPostRecord)
  },[currentUser])

  const handleLikePost = (e:React.MouseEvent)=>{
         e.stopPropagation();

         let newLikes= [...likesList]

        const  hasLiked =newLikes.includes(userId);
        if(hasLiked){
             newLikes=newLikes.filter((id)=> id !=userId)
        }else{
          newLikes.push(userId)
        }

        setlikes(newLikes)
        likePost({postId :post.$id,likesArray : newLikes })
  }

  const handleSavePost = (e:React.MouseEvent)=>{
    e.stopPropagation();
    if(savedPostRecord){
        setIsSaved(false)
        deleteSavedPost(savedPostRecord.$id)
    }else{     
      savePost({postId:post.$id,userId})
      setIsSaved(true)
    }
  }

  return (
    <div
    className="flex justify-between items-center z-20"
    >
       <div className="flex gap-2 mr-5">
         
           <img src={checkIsLiked(likesList,userId)  ? `/assets/icons/liked.svg` : `/assets/icons/like.svg`} 
           alt="like" 
           width={20} height={20}
           onClick={handleLikePost}
           className="cursor-pointer"
           />
           <p className="small-medium lg:base-medium">{likes.length}</p>
       </div>
       <div className="flex gap-2 ">
         {
             (savingPost || deletingPost) ? <Loader/>
             :
          <img src={  `/assets/icons/save${isSaved ? 'd' : ''}.svg`} 
           alt="like" width={20} height={20}
           onClick={handleSavePost}
           className="cursor-pointer"
           />
          }  
      
       </div>
    </div>
  )
}

export default PostStats