import { describe, it, expect } from 'vitest'
import { fetchAllProducts, fetchCategories, fetchProductsByCategory } from '../api/fakestore'

describe('FakeStore API Functions - Fallback Behavior', () => {
  
  it('should return valid products array', async () => {
    const result = await fetchAllProducts()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    
    const firstProduct = result[0]
    expect(firstProduct).toHaveProperty('id')
    expect(firstProduct).toHaveProperty('title')
    expect(firstProduct).toHaveProperty('price')
    expect(firstProduct).toHaveProperty('category')
    expect(firstProduct).toHaveProperty('description')
    expect(firstProduct).toHaveProperty('image')
    expect(firstProduct).toHaveProperty('rating')
  })

  it('should return valid categories array', async () => {
    const result = await fetchCategories()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((cat: any) => typeof cat === 'string')).toBe(true)
  })

  it('should return valid products for a category', async () => {
    const category = 'electronics'
    const result = await fetchProductsByCategory(category)
    
    expect(Array.isArray(result)).toBe(true)
    
    if (result.length > 0) {
      const firstProduct = result[0]
      expect(firstProduct).toHaveProperty('id')
      expect(firstProduct).toHaveProperty('title')
      expect(firstProduct).toHaveProperty('price')
      expect(firstProduct).toHaveProperty('category')
    }
  })
})