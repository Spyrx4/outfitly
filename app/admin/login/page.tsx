// Server Component — shell statis, tidak ada JS di halaman ini
// Hanya LoginForm (client component kecil) yang butuh JS
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950 flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo — static, no JS */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">OF</span>
              </div>
              <span className="font-bold text-xl text-white">Outfitly</span>
            </Link>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-stone-400 text-sm mt-1">Masuk untuk mengelola produk</p>
          </div>

          {/* Login form — satu-satunya bagian yang butuh JS */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
