import ProductCatalog from '@/components/ProductCatalog'
import { Product } from '@/components/ProductCard'

// SSR: render di server saat request
export const dynamic = 'force-dynamic'

async function getProducts(): Promise<Product[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?order=created_at.desc`
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()
  const cats = products.map((p: Product) => p.category).filter(Boolean)
  const categories = ['Semua', ...Array.from(new Set(cats))]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Katalog Produk Shopee Terpilih
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Temukan Produk
            <br />
            <span className="text-amber-100">Terbaik di Shopee</span>
          </h1>
          <p className="text-orange-100 text-lg sm:text-xl max-w-2xl mx-auto">
            Koleksi produk pilihan tangan dengan kualitas terjamin. Klik, dan langsung dapatkan di Shopee!
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-black text-orange-500">{products.length}+</div>
            <div className="text-xs text-gray-500 font-medium">Produk Tersedia</div>
          </div>
          <div className="w-px bg-gray-100 hidden sm:block" />
          <div>
            <div className="text-2xl font-black text-orange-500">{categories.length - 1}+</div>
            <div className="text-xs text-gray-500 font-medium">Kategori</div>
          </div>
          <div className="w-px bg-gray-100 hidden sm:block" />
          <div>
            <div className="text-2xl font-black text-orange-500">100%</div>
            <div className="text-xs text-gray-500 font-medium">Link Asli Shopee</div>
          </div>
        </div>
      </div>

      {/* Catalog + Search + Filter */}
      <ProductCatalog products={products} categories={categories} />
    </>
  )
}
