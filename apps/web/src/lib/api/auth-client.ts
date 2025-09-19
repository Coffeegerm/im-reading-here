import { AuthUser } from "@im-reading-here/shared";

import { apiClient } from "./api-client";
import { apiEndpoints } from "./config";

class AuthClient {
  private readonly apiClient = apiClient;

  getCurrentUser = async () => {
    return this.apiClient.get<AuthUser>(apiEndpoints.auth.me);
  };
}

export const authClient = new AuthClient();
export { AuthClient };
