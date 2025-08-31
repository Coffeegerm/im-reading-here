"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpData } from "@im-reading-here/shared";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();

  const form = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  if (registerMutation.isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Check Your Email</h1>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We&apos;ve sent you a confirmation link. Please check your email
              and click the link to verify your account.
            </p>
            <Button
              onClick={() => router.push("/signin")}
              variant="outline"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((data: SignUpData) => {
            registerMutation.mutate(data);
          })}
          className="space-y-4"
        >
          <div>
            <Input
              {...form.register("name")}
              type="text"
              placeholder="Full Name"
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Email"
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {registerMutation.error && (
            <p className="text-sm text-red-600">
              {registerMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
