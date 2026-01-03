import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  // TODO: Replace with actual database queries when D1 is configured
  const products: any[] = [];
  const totalProducts = 0;
  const totalViews = 0;
  const totalClicks = 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Xin chào, {user.firstName || user.username}!
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý các sản phẩm showcase của bạn
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
        >
          + Tạo sản phẩm mới
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Tổng sản phẩm" value={totalProducts} />
        <StatsCard title="Lượt xem" value={totalViews} />
        <StatsCard title="Lượt nhấn liên hệ" value={totalClicks} />
      </div>

      {/* Products List */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Sản phẩm của bạn
        </h2>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Package className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-slate-500 mb-6">
              Tạo sản phẩm đầu tiên để bắt đầu showcase
            </p>
            <Link
              href="/dashboard/products/new"
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Tạo sản phẩm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product cards will go here */}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
