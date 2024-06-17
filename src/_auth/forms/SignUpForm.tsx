import { Button } from "@/components/ui/button"

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/ui/shared/Loader"
import { Link,useNavigate } from "react-router-dom"
 
import { useToast } from "@/components/ui/use-toast"
// import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"



const SignUpForm = () => {

  

  const navigate=useNavigate(); 
  const { toast } = useToast()

  const {mutateAsync :createUserAccount,isPending : isCreatingAccount}=useCreateUserAccount();
  const {mutateAsync:signInAccount,isPending:isSigningInUser}=useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      name:"",
      password:"",
      email:""
    },
  })

 const {checkAuthUser,isLoading: isUserLoading}=useUserContext();
 
  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof SignupValidation>) {
      const newUser= await createUserAccount(values);          //createUserAccount wlet mutation t3 react-uery
      
      if(!newUser){
        return   toast({
          variant: "destructive",
          title: "user not creataed",
        }) ;
      }
           
        const session = await signInAccount({
          email:values.email,
          password:values.password
        })
              
        if(!session){
          return   toast({
            variant: "destructive",
            title: "session not created",
          }) ;
        } 

     const isLoggedIn = await checkAuthUser();   
     

     //check if user isLoggedIn we reset the form
     
     if(isLoggedIn){ 
      form.reset();
      toast({
        title: "Successfully logged in",
      });
      navigate('/')
     }else{
      //if we're not logged in 
          return  toast({
            variant: "destructive",
            title: "user not logged in",
          }) ;
     }
     
  }

  return (
    
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col " >
           <img src="/assets/images/logo.svg" alt="logo"/>
           <h2 className="h3-bold md:h2-bold pt-5 sm:pt-2">Create a new account</h2>
           <p className="text-light-3 small-medium md:base-regular mt-2">
            To use snapgram,please enter your account details</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full mt-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                              <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                              <Input type="email" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>password</FormLabel>
                            <FormControl>
                              <Input type="password" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
              <Button type="submit" className="shad-button_primary mt-3">
                { isCreatingAccount || isSigningInUser || isUserLoading 
                 ? <div className="flex-center gap-2"><Loader/></div>
                : "Sign up" }
              </Button>
              <p className="text-small-regular text-light-2 text-center mt-2">
                Already have an account ?<Link className="text-primary-500 text-small-semibold ml-1" to="/sign-in">Log In</Link></p>
            </form>
      </div>
    </Form>
  )
}

export default SignUpForm