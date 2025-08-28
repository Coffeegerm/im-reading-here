export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    plan: string;
    emailVerified: boolean;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
