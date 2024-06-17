
import FilterSection from "@/components/ui/shared/FilterSection";
import GridPostListU from "@/components/ui/shared/GridPostListU";
import ProfileInfo from "@/components/ui/shared/ProfileInfo";
import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser, useGetUserByUserId } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useUserContext();
  const { id } = useParams();
  

  const isTheUser=user.id === id

  const { data: userDetails } = useGetCurrentUser();
  const { data: otherCreator } = useGetUserByUserId(id);


  useEffect(() => {
    if (user.id === id && userDetails) {
      setPosts(userDetails?.posts || []);
    } else if (otherCreator) {
      setPosts(otherCreator?.posts || []);
    }
  }, [isTheUser, userDetails, otherCreator]);

  const handleClick = (trigger:any) => {
    if (trigger === 'posts' && user.id === id) {
      setPosts(userDetails?.posts || []);
    } else if (trigger === 'likedPosts' && user.id === id && userDetails?.liked !== null) {
      setPosts(userDetails?.liked); // Assuming 'liked' contains liked posts
    }
  };

        
   
  

  return (
    <div className="w-full flex flex-col gap-7 px-16 py-10">
      <ProfileInfo creator={isTheUser ? userDetails : otherCreator} />
      < FilterSection handleClick={handleClick} id={id}/>
      <div className="w-full p-7">
          <GridPostListU posts={posts} creator={isTheUser ? userDetails : otherCreator}/>
      </div>
    </div>
  );
};

export default Profile;
