import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
import { IUser } from "@/types"

type GridPostListProps = {
  posts: Models.Document[] ,// array of Models.document
  creator: any,
  showUser?:boolean,
  showStats?:boolean
}

const GridPostListU = ({ posts,creator ,showUser=true,showStats=true }: GridPostListProps) => {
  // Get the user logged in the current session
  const { user } = useUserContext()




  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imgUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{creator?.name}</p>
              </div>
            )}
            {( post.likes && showStats) && <PostStats post={post} userId={creator.$id} />}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostListU
