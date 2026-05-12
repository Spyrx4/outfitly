'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Product } from '@/components/ProductCard'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim() === '') return true
    const q = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserEmail(user.email || '')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setProducts(data as Product[])
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    setDeleting(id)
    const supabase = createClient()

    // Delete image from storage if exists
    if (imageUrl) {
      const urlParts = imageUrl.split('/product-images/')
      if (urlParts.length > 1) {
        await supabase.storage.from('product-images').remove([urlParts[1]])
      }
    }

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-800">Dashboard Admin</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Login sebagai: <span className="text-orange-500 font-medium">{userEmail}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/add-product"
              id="btn-add-product"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-500/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Tambah Produk</span>
            </Link>
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-2.5 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-3xl font-black text-orange-500 mb-1">{products.length}</div>
            <div className="text-sm text-gray-500 font-medium">Total Produk</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-3xl font-black text-orange-500 mb-1">
              {new Set(products.map((p) => p.category).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-500 font-medium">Kategori</div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 shadow-sm">
            <div className="text-3xl font-black text-white mb-1">Outfitly</div>
            <div className="text-sm text-orange-100 font-medium">Affiliate Shopee</div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-800">Daftar Produk</h2>
              <span className="text-sm text-gray-400">
                {searchQuery ? `${filteredProducts.length} dari ${products.length} produk` : `${products.length} produk`}
              </span>
            </div>
            {/* Search input */}
            <div className="relative">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="admin-search-products"
                type="text"
                placeholder="Cari nama / kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 w-full sm:w-56 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Hapus pencarian"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin w-8 h-8 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-400 text-sm mt-3">Memuat data produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Belum ada produk</p>
              <p className="text-gray-400 text-sm mt-1">Klik &quot;Tambah Produk&quot; untuk mulai.</p>
            </div>
          ) : filteredProducts.length === 0 && searchQuery ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Produk tidak ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">Tidak ada produk yang cocok dengan &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium underline"
              >
                Hapus filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Produk</th>
                    <th className="px-6 py-3 text-left">Kategori</th>
                    <th className="px-6 py-3 text-left">Link Shopee</th>
                    <th className="px-6 py-3 text-left">Tanggal</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-orange-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800 max-w-[200px] truncate">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {product.category || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={product.shopee_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs truncate max-w-[150px] block"
                        >
                          {product.shopee_link}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(product.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/edit-product/${product.id}`}
                            className="text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.image_url)}
                            disabled={deleting === product.id}
                            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                          >
                            {deleting === product.id ? 'Menghapus...' : 'Hapus'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
