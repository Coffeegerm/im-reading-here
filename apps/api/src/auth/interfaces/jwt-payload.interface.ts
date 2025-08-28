export interface JwtPayload {
  sub: string; // user ID
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
