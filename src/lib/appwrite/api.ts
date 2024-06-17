import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases,  avatars, storage } from "./config";
import {  INewPost, INewUser, IUpdatePost, IUser } from "@/types";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    
    const session= await account.deleteSession("current")

    return session;
    
  } catch (error) {
    console.log(error)
  }
}

//creating a new post 

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imgUrl: fileUrl,
        imgId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;

  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;

  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {

  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;

  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
    
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts({pageParam}:{pageParam:number}){


  const queries: any[] =[Query.orderDesc('$createdAt'),Query.limit(3) ]

  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    //we gonna retreive posts
    const posts= await databases.listDocuments(
      appwriteConfig.databaseId,            //we enter databaseId
      appwriteConfig.postsCollectionId,     //then which collection
      queries
    )
    if(!posts) throw Error;
    
    return posts;
  } catch (error) {
    
  }

}

export async function likePost(postId:string,likesArray:string[]) {
  try {

    const updatePost= await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes:likesArray
      }
    );

    if(! updatePost) throw Error;

    return updatePost;
    
  } catch (error) {
    
  }
}

export async function savePost(postId:string,userId:string) {
  try {

    const savePost= await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user:userId,
        post:postId
      }
    );

    if(! savePost) throw Error;

    return savePost;
    
  } catch (error) {
    
  }
}

export async function deleteSavedPost(savedRecordId:string) {
  try {

    const statusCode= await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    );

    if(! statusCode) throw Error;

    return {status:"ok"};
    
  } catch (error) {
      console.log("error")
  }
}

export async function getPostById(postId:string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )

    return post;
  } catch (error) {
    
  }
}

export async function updatePost(post: IUpdatePost) {

  const hasFileUpdate= post.file.length > 0 ;


  try {

    let image={
    imageUrl:post.imageUrl,
    imageId:post.imageId
    }

    //if the user hasFile to upload instead of the previous one 
   if(hasFileUpdate){

    //here upload our file to the storage
     const uploadedFile = await uploadFile(post.file[0]);
     
     if (!uploadedFile) throw Error;

     // Get file url
     const fileUrl = getFilePreview(uploadedFile.$id);
     
     //if there is no fileUrl we simply delete the file uploaded
         if (!fileUrl) {
           await deleteFile(uploadedFile.$id);
           throw Error;
         }

         
             //then i want to update the image 
          image={...image,imageUrl:fileUrl, imageId:uploadedFile.$id}
    }


    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imgUrl: image.imageUrl,
        imgId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    //checking if there is an updated post
    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    //if everthing goes well i just return the updatedpost
    return updatedPost;

  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string ,imageId:string){


  if(!postId || !imageId) throw Error;

  try {

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return {status: 'ok'}
  } catch (error) {
    console.log(error)
  }


}

export async function   getInfinitePosts({pageParam}:{pageParam:number}) {

  const queries:any[] =[Query.orderDesc('$updatedAt'),Query.limit(10)]  //we want to get the newest posts based on $upadateAt and we fetch by 10 posts
  
    if(pageParam){
      //we're basically saying if we are in for ex page 2 skip the first ten posts and give the 2nd ten posts
        queries.push(Query.cursorAfter(pageParam.toString())) 
    }

    try {
      const posts= await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        queries    //the 3rd param is we pass all the queries that based on them we want to fetch data 
      )

      //we check if we really fetch the posts based on the queries
      if(!posts)  throw Error;
      
      
      return posts;
    
    } catch (error) {
      console.log(error)
    }

}

export async function searchPosts(searchTerm :string) {

    try {
      const posts= await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
         [Query.search('caption',searchTerm)]  //we specify in which colum we wanna seach and we pass search term in the serch() method
      )

      //we check if we really fetch the posts 
      if(!posts)  throw Error;
      
      return posts;
    } catch (error) {
      console.log(error)
    }

}


export async function getAllUser({pageParam}:{pageParam:number}){
    try {

      const queries: any[] =[Query.orderAsc("$createdAt"),Query.limit(10)]

      if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
      }
      
      const users=databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
      )

      if(!users) throw Error

      return users;

    } catch (error) {
        console.log(error)
    }
}

export async function getSavedPosts({pageParam}:{pageParam:number}) {

  try {

    const currentUser =await getCurrentUser();
    if(currentUser != null){

      

      const queries: any[] =[Query.equal('user',currentUser.$id),Query.orderDesc("$createdAt"),Query.limit(10)]

      if(pageParam) queries.push(Query.cursorAfter(pageParam.toString()))

        const SavedPosts=databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.savesCollectionId,
          queries
        )
        if(!SavedPosts ) throw Error;

        return SavedPosts
    }

  } catch (error) {
    console.log(error)
  }
}


export async function getUserByUserId(idUser :string ) {

  try {
    const user= await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
       idUser 
    )

    //we check if we really fetch the posts 
    if(!user)  throw Error;
    
    return user;
  } catch (error) {
    console.log(error)
  }

}

export async function updateProfile(user: any): Promise<IUser> {
  const hasFileUpdate = Array.isArray(user.file) && user.file.length > 0;

  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.id,
    };

    // If the user has a file to upload instead of the previous one
    if (hasFileUpdate) {
      // Upload the file to the storage
      const uploadedFile = await uploadFile(user.file[0]);

      if (!uploadedFile) throw new Error("File upload failed");

      // Get file URL
      const fileUrl = getFilePreview(uploadedFile.$id);

      // If there is no file URL, delete the uploaded file
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("File URL retrieval failed");
      }

      // Update the image details
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.id,
      {
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        username: user.username,
        email: user.email,
        name: user.name,
      }
    );

    // Check if there is an updated user
    if (!updatedUser) {
      await deleteFile(user.imageId);
      throw new Error("User update failed");
    }

    // Return the updated user object
    return {
      id: updatedUser.$id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      imageUrl: updatedUser.imgUrl,
      bio: updatedUser.bio,
    };
  } catch (error) {
    console.log(error);
    throw error; // Ensure the error is thrown to be caught by the mutation
  }
}

