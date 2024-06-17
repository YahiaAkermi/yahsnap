import { z } from "zod"


export const SignupValidation = z.object({
    name:z.string().min(2,{message:"name is too short"}),
    username: z.string().min(2,{message:"username is too short"}),
    email:z.string().email(),
    password:z.string().min(8,{message:"password must be at least 8 characters"})
  })


export const SigninValidation = z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:"password must be at least 8 characters"})
  })


   
  export const PostValidation = z.object({
    caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    file: z.custom<File[]>(),
    location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  });


  export const EditProfileValidation=z.object({
    file: z.custom<File[]>(),
    name: z.string().min(5, { message: "Minimum 5 characters." }).max(50, { message: "Maximum 50 caracters" }),
    username: z.string().min(5, { message: "Minimum 5 characters." }).max(50, { message: "Maximum 50 caracters" }),
    email: z.string().email({ message: "Invalid email address" }),
    bio: z.string().min(5, { message: "Minimum 5 characters." }).max(200, { message: "Maximum 200 caracters" }),
  });