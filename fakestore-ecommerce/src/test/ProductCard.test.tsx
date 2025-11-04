import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import ProductCard from '../components/ProductCard'
import cartSlice from '../store/cartSlice'

const mockStore = configureStore({
  reducer: {
    cart: cartSlice,
  },
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store = {mockStore}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
)

const mockProduct = {
  id: 1,
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "This is a test product description",
  image: "https://example.com/test-image.jpg",
  rating: { rate: 4.5, count: 120 }
}

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    
    expect(screen.getByText('electronics')).toBeInTheDocument()
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('displays truncated description', () => {
    render(
      <TestWrapper>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )
s
    expect(screen.getByText(/This is a test product description.../)).toBeInTheDocument()
  })

  it('shows rating if available', () => {
    render(
      <TestWrapper>
        <ProductCard product = {mockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('4.5')).toBeInTheDocument()
  })
})