import { QueryProvider } from "./query-provider";

import { AuthProvider } from "@/providers/auth-provider";



export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};
