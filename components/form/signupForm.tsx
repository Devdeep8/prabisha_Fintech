"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast"; // Import useToast hook

// Define the schema correctly
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password must be at least 6 characters.",
    }),
    Securityquestion: z.string().min(6, {
      message: "Required answer",
    }),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

// Define the form data type
type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { toast } = useToast(); // Use the useToast hook to show toast notifications

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("Securityquestion", data.Securityquestion);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/signup`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      Cookies.set("token", data.token, { expires: expires} )
      router.replace('/dashboard')
      if (response.ok) {
        toast({
          title: "Sign Up Successful",
          description: "You have been successfully signed up.",
          variant: "info",
        });
        Cookies
      } else {
        console.error("Signup failed");
        toast({
          title: "Sign Up Failed",
          description: "An error occurred during signup.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      toast({
        title: "Sign Up Failed",
        description: "An error occurred while signing up. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return ( 
    <div className="flex justify-center items-center container min-h-screen bg-white dark:bg-black">
      <div className="max-w-xl w-full mx-auto bg-white dark:bg-black shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
          Sign Up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
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
                    <FormLabel className="text-black dark:text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
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
                    <FormLabel className="text-black dark:text-white">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Securityquestion"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-black dark:text-white">
                      What is your teacher&apos;s name? 
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Mr. Smith"
                        {...field}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-black dark:text-white">
                      Profile Image
                    </FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e);
                          field.onChange(e.target.files);
                        }}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-black dark:text-white">
                      Upload your profile image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {imagePreview && (
              <div className="flex justify-center mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
