import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Models } from "appwrite";
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

import { Input } from "../ui/input"
import FileUploader from "../ui/shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { useCreatePost, useCreateUserAccount, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast, useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Toast } from "../ui/toast";
import Loader from "../ui/shared/Loader";

 
type PostFormProps={     //it might be here or not (it depends if we have an update or completly new post)
    post ? :Models.Document   //Models is from appwrite
    action: "Create" | "Update";

}

const PostForm = ({post,action} :PostFormProps) => {

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
          caption: post ? post?.caption : "",
          file:[],
          location : post ? post?.location : "",
          tags: post ? post?.tags.join(',') : ""
        },
      })

      const {mutateAsync :createPost,isPending:isLoadingCreate} = useCreatePost();
    
      const {mutateAsync :updatePost,isPending:isUpadatingPost} = useUpdatePost();


      const {user}=useUserContext()

      const {toast}=useToast()

      const navigate= useNavigate();

      

 async function  onSubmit(values: z.infer<typeof PostValidation>) {
       
         if(post && action =="Update"){
                
          const updatedPost=await updatePost({
            ...values,
            postId: post.$id,
            imageId: post.imgId,
            imageUrl:post.imgUrl
          })

          if( ! updatedPost){
            toast({
              variant:"destructive",
              title: "Please try again",
            });
          }

          return navigate(`/posts/${post.$id}`)

         }


      const newPost= await createPost(
          {
            ...values,
            userId:user.id,
          }
          );
    
      if(!newPost){
        toast({
          variant: "destructive",
          title:"please try again!"
        })
      } 

      navigate('/');

     
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">

      
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
              <Textarea className="shad-textarea custom-scrollbar" {...field} />
            </FormControl>
            <FormMessage  className="shad-form_message"/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Photos</FormLabel>
            <FormControl>
             <FileUploader fieldChange={field.onChange} mediaUrl={post?.imgUrl}/>               
            </FormControl>
            <FormMessage  className="shad-form_message"/>
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Location</FormLabel>
            <FormControl>
             <Input type="text" className="shad-input" {...field}/>
            </FormControl>
            <FormMessage  className="shad-form_message"/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Tags (seperated by comma " , ")</FormLabel>
            <FormControl>
             <Input type="text" className="shad-input" placeholder=" Art, Expression, Learn..etc" {...field }/>
            </FormControl>
            <FormMessage  className="shad-form_message"/>
          </FormItem>
        )}
      />
      <div className="flex gap-4 justify-end items-center">
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap"
        disabled={isLoadingCreate || isUpadatingPost}
        >{ (isLoadingCreate || isUpadatingPost) ? <Loader/> : action}</Button>
      </div>
      
    </form>
  </Form>
  )
}

export default PostForm

