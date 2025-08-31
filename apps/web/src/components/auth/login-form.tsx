"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInData } from "@im-reading-here/shared";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";


export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((data) => {
            signInMutation.mutate(data);
          })}
          className="space-y-4"
        >
          <div>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Email"
              disabled={signInMutation.isPending}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Password"
              disabled={signInMutation.isPending}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {signInMutation.error && (
            <p className="text-sm text-red-600">
              {signInMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
