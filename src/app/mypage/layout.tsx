import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/Header';
import SidebarNav from '@/components/mypage/SidebarNav';

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bsd-dark">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
