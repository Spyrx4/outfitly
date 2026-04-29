'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import ProductCard, { Product } from '@/components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setProducts(data as Product[])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean)
    return ['Semua', ...Array.from(new Set(cats))]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory =
        activeCategory === 'Semua' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, activeCategory])

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

          {/* Search Bar in Hero */}
          <div className="max-w-xl mx-auto relative">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <svg
                className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-products"
                type="text"
                placeholder="Cari produk, kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 text-gray-800 placeholder-gray-400 text-sm focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
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
              {searchQuery
                ? `${filteredProducts.length} hasil untuk "${searchQuery}"`
                : `${products.length} produk tersedia untuk kamu`}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div id="categories" className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white hover:border-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-24">
            <svg className="animate-spin w-8 h-8 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-400 text-sm mt-3">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchQuery ? 'Produk Tidak Ditemukan' : 'Belum Ada Produk'}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ada produk yang cocok dengan "${searchQuery}". Coba kata kunci lain.`
                : 'Produk akan segera ditambahkan. Silakan kunjungi kembali nanti.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium text-sm underline"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
