import { Injectable, UnauthorizedException } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "@im-reading-here/shared";

@Injectable()
export class JwtAuthService {
  private jwtSecret: string;

  constructor() {
    // Supabase JWT secret can be found in your project settings
    this.jwtSecret = process.env.SUPABASE_JWT_SECRET || "";
  }

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      if (!this.jwtSecret) {
        console.warn("JWT secret not configured - skipping token verification");
        return null;
      }

      const decoded = verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  }
}
