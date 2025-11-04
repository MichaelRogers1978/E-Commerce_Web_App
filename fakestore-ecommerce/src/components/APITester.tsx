import { useState } from 'react'
import { fetchAllProducts, fetchCategories, fetchProductsByCategory } from '../api/fakestore'

export default function APITester() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAllProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllProducts()
      setProducts(data)
      console.log('Fetched products:', data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const testCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCategories()
      setCategories(data)
      console.log('Fetched categories:', data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const testCategoryProducts = async (category: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProductsByCategory(category)
      setProducts(data)
      console.log(`Fetched ${category} products:`, data)
    } catch (err: any) {
      setError(err.message)
      console.error(`Error fetching ${category} products:`, err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', border: '2px solid #007bff', margin: '1rem', borderRadius: '8px' }}>
      <h2>API Tester</h2>
      
      <div style = {{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick = {testAllProducts} disabled = {loading} className="button">
          Test All Products
        </button>
        <button onClick = {testCategories} disabled = {loading} className = "button">
          Test Categories
        </button>
        <button onClick = {() => testCategoryProducts('electronics')} disabled = {loading} className = "button">
          Test Electronics
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style = {{ color: 'red' }}>Error: {error}</p>}

      {categories.length > 0 && (
        <div>
          <h3>Categories ({categories.length}):</h3>
          <p>{categories.join(', ')}</p>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h3>Products ({products.length}):</h3>
          <div style = {{ maxHeight: '300px', overflow: 'auto' }}>
            {products.slice(0, 3).map(product => (
              <div key = {product.id} style = {{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
                <strong>{product.title}</strong> - ${product.price}
                <br />
                <small>Category: {product.category}</small>
              </div>
            ))}
            {products.length > 3 && <p>...and {products.length - 3} more</p>}
          </div>
        </div>
      )}
    </div>
  )
}