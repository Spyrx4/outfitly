'use client'

import { useState, useMemo } from 'react'
import ProductCard, { Product } from '@/components/ProductCard'

interface ProductCatalogProps {
  products: Product[]
  categories: string[]
}

export default function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

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
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative mb-0">
        <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
          <svg
            className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
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
