import { Shelf } from "@im-reading-here/shared";

import { apiClient } from "./api-client";
import { apiEndpoints } from "./config";

class ShelvesClient {
  private readonly apiClient = apiClient;

  getShelves(userId: string) {
    return this.apiClient.get<Shelf[]>(`${apiEndpoints.users.shelves(userId)}`);
  }

  getShelf(shelfId: string) {
    return this.apiClient.get<Shelf>(`${apiEndpoints.shelves.byId(shelfId)}`);
  }
}

export const shelvesClient = new ShelvesClient();
export { ShelvesClient };
