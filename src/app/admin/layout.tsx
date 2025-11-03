import { AdminGuard } from '@/components/auth/admin-guard'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <AdminBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
