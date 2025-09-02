import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard'
import { OptionalAuthGuard } from '../common/guards/optional-auth.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, OptionalAuthGuard],
  exports: [AuthService, SupabaseAuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
