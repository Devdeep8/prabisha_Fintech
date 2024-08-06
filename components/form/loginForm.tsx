import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import cookies from "js-cookie";

// Define the schema correctly
const formSchema = z.object({
  identifier: z.string().min(2, {
    message: "Username or Email must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Define the form data type
type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { toast } = useToast();

  const authenticate = async (data: any) => {
    let token: string | undefined;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        cookies.set("token", result.token, { expires: expires });
        return result;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authenticate(data);
      if (result.message === "Authenticated") {

        router.replace(`/dashboard`);
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in.",
          variant: "success", // Use the success variant
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive", // This variant can be styled as red
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An Error Occurred",
        description: "Unable to login. Please try again later.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full mx-auto shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username or Email"
                      {...field}
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 dark:text-gray-400">
                    Enter your username or email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={"/forgot_password"}
              className="text-blue-500 hover:text-blue-800 visited:text-violet-500 underline"
            >
              Forgot Password
            </Link>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Login
            </Button>
          </form>
        </Form>
        <p className="my-4">
          If you don&apos;t have an account, click{" "}
          <Link
            className="text-blue-500 hover:text-blue-800 visited:text-violet-500 underline"
            href={"/signup"}
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
