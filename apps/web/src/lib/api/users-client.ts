import { User } from "@im-reading-here/shared";

import { apiEndpoints } from "../config";

import { apiClient } from "./api-client";


class UsersClient {
  private readonly apiClient = apiClient;

  getUser(userId: string) {
    return this.apiClient.get<User>(apiEndpoints.users.byId(userId));
  }
}

export const usersClient = new UsersClient();
export { UsersClient };
