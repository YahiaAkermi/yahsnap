import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import GridPostList from "@/components/ui/shared/GridPostList"
import Loader from "@/components/ui/shared/Loader"
import PostStats from "@/components/ui/shared/PostStats"
import { useUserContext } from "@/context/AuthContext"
import { useGetPostById, useGetPostsByUser } from "@/lib/react-query/queriesAndMutations"
import { timeAgo } from "@/lib/utils"
import { Link, useParams } from "react-router-dom"



const PostDetails = () => {

  const {id}=useParams()

  const {data:post,isPending}=useGetPostById(id || '')

  
  
  const {user} =useUserContext()
  
  const {data:relatedPosts}=useGetPostsByUser(post?.creator.$id);

  const filtedRelatedPosts=relatedPosts?.documents.filter((post)=>post.$id !== id) || []

  console.log(relatedPosts  )
  
  const handleDeletePost = () => {

  }

  return (
    <div className="post_details-container">
         {
          isPending ? <Loader/>
          :
          <div className="post_details-card">
            <img 
            src={post?.imgUrl} 
            alt="post_image"
            className="post_details-img"
            />
                 <div className="post_details-info">
                    <div className="flex-between w-full">
                        <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                              <img src={post?.creator.imgUrl || '/assets/icons/profile-placeholder.svg' } 
                              alt="profile image"
                              className="rounded-full w-8 h-8 lg:h-12 lg:w-12" 
                              />
                        
                              <div className="flex flex-col ">
                                <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                                <div className="flex-center gap-2 text-light-3">
                                  <p className="subtle-semibold lg:small-regular">{timeAgo(post?.$createdAt)}</p>
                                  -
                                  <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                                </div>
                              </div>
                        </Link> 
                        <div className="flex-center gap-4">
                               <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id ? 'hidden' :''}`}>
                                   <img src="/assets/icons/edit.svg" alt="edit" height={24} width={24} />
                               </Link>
                               <Button
                               onClick={handleDeletePost}
                               variant="ghost"
                               className={`${user.id !== post?.creator.$id ? 'hidden' :''} ghost_details-delete_btn`}
                               >
                                     <img src="/assets/icons/delete.svg" alt="delete" height={24} width={24} />   
                               </Button>
                        </div>
                    </div>
                    <hr  className="border w-full border-dark-4/80"/>

                    <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                          <p>{post?.caption}</p>
                          <ul className="flex gap-1 mt-2">
                            {post?.tags?.map((tag:string)=>(
                                <li className="text-light-3" key={tag}>#{tag}</li>
                            ))}
                          </ul>
                    </div>
                    <div className="w-full">
                         <PostStats post={post!} userId={user.id}/>
                    </div>
                 </div>
          </div>
         }
         <Separator className=" bg-dark-4" />
         <div className="w-full flex flex-col gap-7">
            <h2 className="h3-bold ">Related Posts</h2>
            <div className="w-full flex justify-center items-center">

                  {
                    filtedRelatedPosts?.length > 0 ?
                    <GridPostList posts={filtedRelatedPosts}/>
                    :
                    <div className="w-full flex justify-center items-center text-light-4 font-semibold text-xl p-9">
                            No Post for {user.name} for the moment
                    </div> 
                  }
            </div>
         </div>
    </div>
  )
}

export default PostDetails