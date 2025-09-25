"use client";
import { useQuery } from "@tanstack/react-query";

import { shelvesClient } from "@/lib/api/shelves-client";

export function useShelvesForUser(userId: string) {
  return useQuery({
    queryKey: ["shelves", userId],
    queryFn: () => shelvesClient.getShelves(userId),
  });
}

export function useShelf(shelfId: string) {
  return useQuery({
    queryKey: ["shelf", shelfId],
    queryFn: () => shelvesClient.getShelf(shelfId),
  });
}
