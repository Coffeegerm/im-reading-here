import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No auth header, continue without user
      request.user = null
      return true
    }

    const token = authHeader.substring(7)
    const user = await this.authService.validateUser(token)

    // Set user if valid, null if invalid - but always continue
    request.user = user
    return true
  }
}
