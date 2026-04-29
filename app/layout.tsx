import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Outfitly — Katalog Outfit & Fashion Shopee Terpercaya',
  description:
    'Temukan outfit dan fashion pilihan terbaik dari Shopee di Outfitly. Katalog lengkap dengan harga terbaik, klik dan langsung beli di Shopee!',
  keywords: ['shopee', 'affiliate', 'katalog produk', 'belanja online', 'oz store'],
  openGraph: {
    title: 'Outfitly — Katalog Outfit & Fashion Shopee',
    description: 'Temukan produk pilihan terbaik dari Shopee.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-50">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-100 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">OF</span>
              </div>
              <span className="font-bold text-gray-700">Outfitly</span>
            </div>
            <p className="text-sm text-gray-400">
              Website ini adalah katalog affiliate Shopee. Setiap pembelian melalui link di sini membantu kami. 🧡
            </p>
            <p className="text-xs text-gray-300 mt-2">
              © {new Date().getFullYear()} Outfitly. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
