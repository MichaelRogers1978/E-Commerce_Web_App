import { describe, it, expect } from 'vitest'
import { fetchAllProducts, fetchCategories, fetchProductsByCategory } from '../api/fakestore'

describe('FakeStore API Integration Tests', () => {
  
  it('should fetch real products from FakeStore API', async () => {
    const products = await fetchAllProducts()
    
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    
    const firstProduct = products[0]
    expect(firstProduct).toHaveProperty('id')
    expect(firstProduct).toHaveProperty('title')
    expect(firstProduct).toHaveProperty('price')
    expect(firstProduct).toHaveProperty('category')
    expect(firstProduct).toHaveProperty('description')
    expect(firstProduct).toHaveProperty('image')
    expect(firstProduct).toHaveProperty('rating')
    
    expect(typeof firstProduct.id).toBe('number')
    expect(typeof firstProduct.title).toBe('string')
    expect(typeof firstProduct.price).toBe('number')
  }, 10000) 

  it('should fetch real categories from FakeStore API', async () => {
    const categories = await fetchCategories()
    
    expect(Array.isArray(categories)).toBe(true)
    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toContain('electronics')
  }, 10000)

  it('should fetch products by category from FakeStore API', async () => {
    const category = 'electronics'
    const products = await fetchProductsByCategory(category)
    
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    
    products.forEach((product: any) => {
      expect(product.category).toBe(category)
    })
  }, 10000)
})