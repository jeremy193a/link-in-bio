import { UserButton } from '@clerk/nextjs';
import { LayoutDashboard, Package, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-emerald-600">
                Showcase
              </Link>
              <div className="hidden md:flex gap-4">
                <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />}>
                  Dashboard
                </NavLink>
                <NavLink href="/dashboard/products/new" icon={<Package size={18} />}>
                  Sản phẩm
                </NavLink>
                <NavLink href="/dashboard/settings" icon={<Settings size={18} />}>
                  Cài đặt
                </NavLink>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
