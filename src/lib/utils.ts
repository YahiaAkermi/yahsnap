import { useUserContext } from "@/context/AuthContext";

import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(timestamp?: string ): string {


  if (!timestamp) {
    return "Unknown"; // or any default value or appropriate handling
  }else{

    const currentDate: Date = new Date();
    const postDate: Date = new Date(timestamp);
  
    const timeDifference: number = currentDate.getTime() - postDate.getTime();
    const seconds: number = Math.floor(timeDifference / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
  
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  }

}


export const checkIsLiked = (likeList: string[], userId: string)  => {
  return likeList.includes(userId);
};

// export const extractFollwedByUser = (likesArray : any[] ) : any =>{

//   const user =useUserContext()

//                 likesArray.map((item : any)=>{
//                  return item.creator.username !== user.user.username  ?? item.creator.username 
//                 console.log(item) 
//                 })
// }

export const checkStringLength =(s:string) :string =>{
             return s.length > 5 ? s.substring(0,4)+'..'.toString() : s
}




type storiesType={
  img: string,
  title: string
}
export const stories : storiesType[] =[
  {
      img:"/assets/images/media.png",
      title:"React Course"
  },
  {
      img:"/assets/images/cube.png",
      title:"Web3 Course"
  },
  {
      img:"/assets/images/js.png",
      title:"Js Course"
  },
  {
      img:"/assets/images/case.png",
      title:"MasterClass"
  },
  {
      img:"/assets/images/qa.png",
      title:"FAQ"
  },
  {
      img:"/assets/images/qa.png",
      title:"FAQ"
  },
  {
      img:"/assets/images/qa.png",
      title:"FAQ"
  },
  {
      img:"/assets/images/qa.png",
      title:"FAQ"
  },
]