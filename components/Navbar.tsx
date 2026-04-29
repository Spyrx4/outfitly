import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:shadow-orange-200 transition-shadow">
              <span className="text-white font-black text-sm tracking-tight">OF</span>
            </div>
            <span className="font-bold text-xl text-gray-800">
              Outfitly
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
