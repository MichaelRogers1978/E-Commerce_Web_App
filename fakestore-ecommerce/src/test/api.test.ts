import { describe, it, expect, vi } from 'vitest'
import { fetchAllProducts, fetchCategories } from '../api/fakestore'

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    }),
  },
}))

describe('FakeStore API', () => {
  it('fetchAllProducts returns product data', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        category: 'electronics',
        description: 'Test description',
        image: 'test-image.jpg',
        rating: { rate: 4.5, count: 120 }
      }
    ]

    const products = await fetchAllProducts()
    
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    
    const firstProduct = products[0]
    expect(firstProduct).toHaveProperty('id')
    expect(firstProduct).toHaveProperty('title')
    expect(firstProduct).toHaveProperty('price')
    expect(firstProduct).toHaveProperty('category')
  })

  it('fetchCategories returns category data', async () => {
    const categories = await fetchCategories()
    
    expect(Array.isArray(categories)).toBe(true)
    expect(categories.length).toBeGreaterThan(0)
    expect(typeof categories[0]).toBe('string')
  })
})