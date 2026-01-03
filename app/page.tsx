import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-emerald-600">Showcase</div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Bắt đầu miễn phí
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Tạo trang showcase sản phẩm
            <br />
            <span className="text-emerald-600">trong vài phút</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Link-in-bio thông minh cho sản phẩm custom tại Việt Nam.
            Tích hợp AI, tối ưu cho Zalo & WhatsApp.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-lg shadow-xl transition-colors"
            >
              Tạo trang showcase ngay
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Tạo trong 5 phút"
            description="Upload ảnh, điền thông tin, và có ngay trang showcase chuyên nghiệp"
          />
          <FeatureCard
            title="AI tự động viết mô tả"
            description="Claude AI giúp bạn tạo mô tả sản phẩm hấp dẫn bằng tiếng Việt"
          />
          <FeatureCard
            title="Tối ưu cho Zalo"
            description="Nút liên hệ trực tiếp qua Zalo, WhatsApp, hoặc điện thoại"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
