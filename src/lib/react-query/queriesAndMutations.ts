import {
  
        //for fetching the data
    useMutation,   
     useQuery,    //for modifying the data
    useQueryClient,
        //for infinite scroll
}  from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getAllUser, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getSavedPosts, getUserByUserId, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateProfile } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'

import { QUERY_KEYS } from "./queryKeys";


export const useCreateUserAccount=()=>{
    return useMutation({     //useMutation li importitha
          mutationFn:  //hna ndefini mutation function t3i which gonna call createUserAccount() which we created in api.ts
          (user:INewUser)=>createUserAccount(user)         
    })
}

export const useSignInAccount=()=>{
    return useMutation({     //useMutation li importitha
          mutationFn:  //hna ndefini mutation function t3i which gonna call signInAccount() which we created in api.ts
          (user:{email:string,password:string})=>signInAccount(user)     //i need only email and password to create session     
    })
}


export const useSignOutAccount=()=>{
    return useMutation(
        {mutationFn:signOutAccount}
        )  
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) =>{
        return createPost(post);
      } ,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };


  
  export const useLikePost =()=>{
    const queryClient=useQueryClient();
    
    return useMutation({
    mutationFn:({postId,likesArray} :{postId:string,likesArray:string[]})=>likePost(postId,likesArray),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]   //here when we see the post in details tha's why i added data?.id to specify which post
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS,]   //when we display the post in home , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS,]   //this general , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]  //when we enter in the user profile , we don't have to specify the post Id     
      })
    }
  })
}

export const useSavePost =()=>{
  const queryClient=useQueryClient();

  return useMutation({
    mutationFn:({postId,userId} :{postId:string,userId:string})=>savePost(postId,userId),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS,]   //when we display the post in home , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS,]   //this general , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]  //when we enter in the user profile , we don't have to specify the post Id     
      })
    }
  })
}

export const usedeleteSavedPost =()=>{
  const queryClient=useQueryClient();
  
  return useMutation({
    mutationFn:(savedRecordId :string)=>deleteSavedPost(savedRecordId),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS,]   //when we display the post in home , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS,]   //this general , we don't have to specify the post Id
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]  //when we enter in the user profile , we don't have to specify the post Id     
      })
    }
  })
}


export const useGetCurrentUser =()=>{
   return  useQuery({
     queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn:()=>getCurrentUser(),
   })
  }
  
export const useGetPostById=(postId:string)=>{
  return  useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn:()=>getPostById(postId),
    enabled:!!postId  //if we are fetching the data for same id just give the last result of fetch from the cache else refetch it from the DB server
  })
}

export const useUpdatePost= ()=>{
  
  const queryClient= useQueryClient();
  
  return useMutation({
    mutationFn:(post:IUpdatePost)=>updatePost(post),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        })
    }
  })

}

export const useDeletePost= ()=>{

  const queryClient= useQueryClient();

  return useMutation({
    mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
    onSuccess:()=>{
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
        })
      }
  })

}





export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage:any) => {
      
      // If there's no data, there are no more pages.
      if (!lastPage || !lastPage.documents || lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0, // Specify the initial page parameter
  });
};

export const useGetSavedPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getSavedPosts as any,
    getNextPageParam: (lastPage:any) => {
      
      // If there's no data, there are no more pages.
      if (!lastPage || !lastPage.documents || lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0, // Specify the initial page parameter
  });
};
export const useGetRecentPost=()=>{
  return useInfiniteQuery({
    queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
    queryFn:getRecentPosts as any,
    getNextPageParam:(lastPage :any)=>{

      if(!lastPage || !lastPage.documents || lastPage.documents.length===0) return null;

      const lastId=lastPage.documents[lastPage.documents.length-1].$id;

      return lastId
    },
    initialPageParam:0
  })
}  

export const useSearchPost =(searchTerm : string) => {
  return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn:()=>searchPosts(searchTerm),
    enabled: !!searchTerm,   //hedi y3ni ghadi ydir refetch when the search term change
  })}


  export const useGetAllUsers = ()=>{
    return useInfiniteQuery({
      initialPageParam:0,
      queryKey:[QUERY_KEYS.GET_USERS],
      queryFn: getAllUser as any,
      getNextPageParam: (lastPage :any)=>{
         // If there's no data, there are no more pages.
      if (!lastPage || !lastPage.documents || lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
      }
    })
  }


  export const useGetUserByUserId =(userId: any)=>{
    return useQuery({
           queryKey:[QUERY_KEYS.GET_USER_BY_ID,userId],
           queryFn:()=>getUserByUserId(userId),
    })
  }


  export const useUpdateProfile= ()=>{
  
    const queryClient= useQueryClient();
    
    return useMutation({
      mutationFn:(user:any)=>updateProfile(user),
      onSuccess:(data)=>{
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
          })
      }
    })
  
  }