import { Models } from "appwrite"
import { Link } from "react-router-dom"




type FlexPostListProps = {
    posts: Models.Document[] ,// array of Models.document
    creator:any,
    showUser?:boolean,
    showStats?:boolean
  }

const PostCardsb = ({ posts,creator ,showUser=true}: FlexPostListProps) => {
  return (
    <div className="w-full flex flex-col gap-5 p-7">
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
          </div>
        </li>
      ))}
    </div>
  )
}

export default PostCardsb