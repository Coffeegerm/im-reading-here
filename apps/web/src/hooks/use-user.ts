import { useQuery } from "@tanstack/react-query";

import { usersClient } from "@/lib/api/users-client";

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return usersClient.getUser(userId);
    },
  });
}
