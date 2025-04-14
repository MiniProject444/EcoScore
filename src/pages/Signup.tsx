
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { Lock, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Enhanced email validation regex to ensure it follows a proper email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .regex(emailRegex, "Please enter a valid email address that contains a domain extension (like .com)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupValues) => {
    console.log("Signup form submitted with values:", values);
    setIsLoading(true);
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          }
        }
      });

      if (error) {
        console.error("Signup error details:", error);
        
        // Provide more specific error messages based on error codes
        if (error.message.includes("email")) {
          throw new Error("Please enter a valid email address with a proper domain (e.g., example@domain.com)");
        } else {
          throw error;
        }
      }

      if (data?.user) {
        login({
          id: data.user.id,
          name: values.name,
          email: values.email,
        }, data.session?.access_token || null);
        
        toast({
          title: "Account created",
          description: "Your account has been successfully created",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check email validity with a stronger validation
  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <div className="eco-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-eco-neutral-700">Create an Account</h1>
          <p className="text-eco-neutral-500 mt-2">Join us to get personalized eco tips</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-eco-neutral-500" />
                      <Input 
                        placeholder="Your name" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-eco-neutral-500" />
                      <Input 
                        placeholder="your.email@example.com" 
                        className="pl-10"
                        onBlur={(e) => {
                          if (e.target.value && !validateEmail(e.target.value)) {
                            toast({
                              variant: "destructive",
                              title: "Invalid Email Format",
                              description: "Please enter a valid email with a domain extension (e.g., .com)",
                            });
                          }
                          field.onBlur();
                        }}
                        {...field} 
                      />
                    </div>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-eco-neutral-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-eco-neutral-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full eco-gradient" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <p className="text-eco-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
