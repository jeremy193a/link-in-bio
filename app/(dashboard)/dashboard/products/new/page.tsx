import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ProductForm } from '@/components/dashboard/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewProductPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">Tạo sản phẩm mới</h1>
          <p className="text-slate-600 mt-2">
            Điền thông tin sản phẩm để tạo showcase chuyên nghiệp
          </p>
        </div>

        {/* Form */}
        <ProductForm userId={user.id} />
      </div>
    </div>
  );
}
