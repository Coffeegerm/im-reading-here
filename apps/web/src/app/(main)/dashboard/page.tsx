import { DashboardContent } from './dashboard-content'

import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
