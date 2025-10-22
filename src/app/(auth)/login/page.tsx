"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
import { useLogin } from "@/api-config/queries/auth";
import Card from "@/components/card";
import { useMessage } from "@/app/contexts/MessageContext";
import loginSchema, { LoginFormValues } from "./schema/login";
import LogoIcon from "@/components/svg-icons/logo";

export default function LoginForm() {
  const message = useMessage();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const loadingId = message.loading("Logging in...", 0);

    try {
      await mutateAsync(data);
      message.remove(loadingId);
      message.success("Login successful!");
      window.location.href = "/";
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
    }
  };

  return (
    <div
      className="min-h-screen min-w-[300px] flex items-center justify-center"
      style={{
        backgroundImage: "url('/logo/login-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Optional: Semi-transparent overlay */}
      <div className="absolute min-w-[300px] inset-0 bg-gradient-to-b from-primary/30 to-secondary/20 z-0"></div>

      <div className="relative z-10 h-screen flex items-center justify-center">
        <Card
          imageSrc={<LogoIcon className="w-40 h-40" />}
          imageAlt="Logo"
          description="Login to your account"
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl max-w-lg w-full hover:shadow-2xl transition-shadow "
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            placeholder="name@gmail.com"
                            className="pl-10 h-10 border-input bg-background"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs"/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-10 border-input bg-background"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 mt-3 hover:text-secondary-foreground hover:bg-primary/60"
              >
                Log in
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
