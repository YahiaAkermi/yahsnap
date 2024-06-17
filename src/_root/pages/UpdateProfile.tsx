import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/ui/shared/FileUploader";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/context/AuthContext";
import { EditProfileValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useGetCurrentUser, useUpdateProfile } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/shared/Loader"; // Ensure Loader component is imported

import PostCardsb from "@/components/ui/shared/PostCardsb";

const UpdateProfile = () => {
  const { user, setUser } = useUserContext();
  const [profileImageUrl, setProfileImageUrl] = useState(user.imageUrl);

  const { mutateAsync: updateProfile, isPending:isUpdating } = useUpdateProfile();

  const { data: userDetails } = useGetCurrentUser();

  console.log(userDetails)

  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof EditProfileValidation>>({
    resolver: zodResolver(EditProfileValidation),
    defaultValues: {
      file: [],
      name: "",
      username: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        file: [],
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
      setProfileImageUrl(user.imageUrl); // Set the initial profile image URL
    }
  }, [user, form]);

  const handleFileUpload = (files: File[]) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImageUrl(reader.result as string); // Update profile image URL state
    };
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof EditProfileValidation>) => {
    const updatedUser = {
      ...user,
      ...values,
      file: values.file || [],
    };

    try {
      const updatedProfile = await updateProfile(updatedUser);

      if (!updatedProfile) {
        toast({
          variant: "destructive",
          title: "Please try again",
        });
      } else {
        setUser(updatedProfile);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        navigate(`/profile/${user.id}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex">
      <div className="max-md:w-full w-[70%] p-11 flex flex-col gap-14 overflow-scroll custom-scrollbar">
        <div className="flex justify-start items-center gap-7">
          <img src="/assets/icons/edit3.png" alt="" height={40} width={40} className="" />
          <h2 className="h2-bold">Edit Profile</h2>
        </div>
        <div className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex flex-col gap-9">
                    <div className="flex justify-start items-center gap-7">
                      <img src={profileImageUrl} alt="" height={100} width={100} className="rounded-full" />
                      <div className="bg-transparent text-[#0095F6] text-lg font-semibold hover:cursor-pointer">Change Profile Photo</div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="shad-form_label">Add Photos</FormLabel>
                        <FormControl>
                          <FileUploader fieldChange={(files) => { field.onChange(files); handleFileUpload(files); }} mediaUrl={user.imageUrl} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </DialogContent>
              </Dialog>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Bio</FormLabel>
                    <FormControl>
                      <Textarea className="shad-textarea custom-scrollbar" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 max-sm:justify-center justify-end items-center">
                <Button type="button" className="shad-button_dark_4">Cancel</Button>
                <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isUpdating}>
                  {isUpdating ? <Loader /> : 'Update Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="h-screen w-[30%] max-md:hidden pt-14 overflow-y-scroll custom-scrollbar">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3">
              <img src={profileImageUrl} alt="" height={100} width={100} className="rounded-full" />
              <h2 className="h2-bold">{user.name}</h2>
              <h2 className="subtle-semibold lg:small-regular text-light-3">@{user.username}</h2>
          </div>
          <h3 className="h3-bold px-3">Your Top Posts</h3>
          <PostCardsb posts={userDetails?.posts} creator={user} />                      
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
