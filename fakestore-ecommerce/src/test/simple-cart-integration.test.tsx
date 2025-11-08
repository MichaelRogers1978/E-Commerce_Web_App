import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import cartSlice from '../store/cartSlice'
import ProductCard from '../components/ProductCard'

vi.mock('../hooks/useFirebaseAuth', () => {
  return {
    default: () => ({
      user: { email: 'test@example.com', uid: 'test-uid' },
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false
    })
  }
})

vi.mock('../services/cartService', () => ({
  syncCartWithFirebase: vi.fn(() => Promise.resolve())
}))

const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
  })
}

const TestWrapper = ({ children, store }: { children: React.ReactNode, store: any }) => (
  <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
)

const mockProduct = {
  id: 1,
  title: "Integration Test Product",
  price: 25.99,
  category: "test",
  description: "Product for integration testing",
  image: "https://example.com/test.jpg",
  rating: { rate: 4.0, count: 50 }
}

describe('Cart Integration Tests - Core Functionality', () => {
  it('should add product to cart and update store state', () => {
    const store = createTestStore()

    render(
      <TestWrapper store = {store}>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )

    expect(store.getState().cart.items).toHaveLength(0)

    const addButton = screen.getByText('Add to Cart')
    fireEvent.click(addButton)

    const cartItems = store.getState().cart.items
    expect(cartItems).toHaveLength(1)
    expect(cartItems[0]).toMatchObject({
      id: 1,
      title: "Integration Test Product",
      price: 25.99,
      quantity: 1
    })
  })

  it('should increase quantity when same product added multiple times', () => {
    const store = createTestStore()

    render(
      <TestWrapper store = {store}>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )

    const addButton = screen.getByText('Add to Cart')

    fireEvent.click(addButton)
    fireEvent.click(addButton)

    const cartItems = store.getState().cart.items
    expect(cartItems).toHaveLength(1)
    expect(cartItems[0].quantity).toBe(2)
  })

  it('should handle multiple different products correctly', () => {
    const store = createTestStore()
    const secondProduct = {
      ...mockProduct,
      id: 2,
      title: "Second Product"
    }

    render(
      <TestWrapper store={store}>
        <div>
          <ProductCard product = {mockProduct} />
          <ProductCard product = {secondProduct} />
        </div>
      </TestWrapper>
    )

    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    fireEvent.click(addButtons[1])

    const cartItems = store.getState().cart.items
    expect(cartItems).toHaveLength(2)
    expect(cartItems[0].id).toBe(1)
    expect(cartItems[1].id).toBe(2)
  })

  it('should calculate correct total quantities across products', () => {
    const store = createTestStore()

    render(
      <TestWrapper store = {store}>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )

    const addButton = screen.getByText('Add to Cart')

    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    const cartItems = store.getState().cart.items
    const totalQuantity = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    expect(totalQuantity).toBe(3)
  })
})