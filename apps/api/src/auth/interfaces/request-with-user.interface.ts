import { Request } from 'express'
import { AuthUser } from '@im-reading-here/shared'

export interface RequestWithUser extends Request {
  user: AuthUser
}
