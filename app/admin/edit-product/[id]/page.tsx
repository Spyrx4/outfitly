'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    category: '',
    shopee_link: '',
  })
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const CATEGORIES = [
    'Elektronik',
    'Fashion Pria',
    'Fashion Wanita',
    'Kecantikan',
    'Rumah & Dapur',
    'Olahraga',
    'Mainan & Hobi',
    'Otomotif',
    'Makanan & Minuman',
    'Kesehatan',
    'Lainnya',
  ]

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  async function fetchProduct() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setForm({
          name: data.name,
          category: data.category || '',
          shopee_link: data.shopee_link,
        })
        if (data.image_url) {
          setCurrentImageUrl(data.image_url)
          setImagePreview(data.image_url)
        }
      }
    } catch (err: any) {
      setError('Gagal memuat data produk: ' + err.message)
    } finally {
      setFetching(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.shopee_link) {
      setError('Nama produk dan link Shopee wajib diisi.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      let finalImageUrl = currentImageUrl

      // Step 1: Upload new image if provided
      if (imageFile) {
        if (currentImageUrl) {
          const urlParts = currentImageUrl.split('/product-images/')
          if (urlParts.length > 1) {
            await supabase.storage.from('product-images').remove([urlParts[1]])
          }
        }

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Gagal upload gambar: ${uploadError.message}`)
        }

        // Step 2: Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        finalImageUrl = urlData.publicUrl
      }

      // Step 3: Update product in database
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: form.name,
          category: form.category,
          shopee_link: form.shopee_link,
          image_url: finalImageUrl,
        })
        .eq('id', id)

      if (updateError) {
        throw new Error(`Gagal memperbarui produk: ${updateError.message}`)
      }

      setSuccess('Produk berhasil diperbarui! 🎉')

      // Redirect after 2 seconds
      setTimeout(() => router.push('/admin/dashboard'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <svg className="animate-spin w-8 h-8 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-500 font-medium">Memuat data produk...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-800">Edit Produk</h1>
            <p className="text-xs text-gray-400">Ubah data produk di bawah ini</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-4 rounded-2xl">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Gambar Produk
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
                ${imagePreview ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative h-52">
                  <Image
                    src={imagePreview}
                    alt="Preview produk"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Ganti Gambar
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-52 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP hingga 5MB</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="image-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="product-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Produk <span className="text-red-400">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Contoh: Sepatu Sneakers Pria Original"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="product-category" className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="product-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shopee-link" className="block text-sm font-semibold text-gray-700 mb-2">
              Link Shopee <span className="text-red-400">*</span>
            </label>
            <input
              id="shopee-link"
              type="url"
              value={form.shopee_link}
              onChange={(e) => setForm({ ...form, shopee_link: e.target.value })}
              required
              placeholder="https://shopee.co.id/produk..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Salin link produk dari Shopee (gunakan link affiliate jika ada)
            </p>
          </div>

          <hr className="border-gray-100" />

          <div className="flex items-center gap-3">
            <button
              id="btn-update-product"
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
