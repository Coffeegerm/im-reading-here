"use client"
import { useUser } from "@/hooks/use-user";

export function UserProfileContent({ userId }: { userId: string | "me" }) {
  const { data: user, isLoading, error } = useUser(userId);

  return <div>UserProfileContent for {userId}</div>;
}
