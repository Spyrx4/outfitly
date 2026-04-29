import { createClient } from '@/lib/supabase'
import ProductCard, { Product } from '@/components/ProductCard'

export const revalidate = 60 // ISR: revalidate every 60 seconds

async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

async function getCategories(products: Product[]): Promise<string[]> {
  const cats = products.map((p) => p.category).filter(Boolean)
  return ['Semua', ...Array.from(new Set(cats))]
}

export default async function HomePage() {
  const products = await getProducts()
  const categories = await getCategories(products)

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
          <p className="text-orange-100 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Koleksi produk pilihan tangan dengan kualitas terjamin. Klik, dan langsung dapatkan di Shopee!
          </p>
          <a
            href="#katalog"
            className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-200"
          >
            Lihat Katalog
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
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

      {/* Catalog Section */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Katalog Produk</h2>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} produk tersedia untuk kamu
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div id="categories" className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-orange-200 text-orange-600 bg-orange-50 cursor-pointer hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Produk akan segera ditambahkan. Silakan kunjungi kembali nanti atau hubungi admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
