import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Header from '../components/Header'
import cartSlice from '../store/cartSlice'

vi.mock('../hooks/useFirebaseAuth', () => ({
    useFirebaseAuth: () => ({
        user: { email: 'test@example.com', displayName: 'Test User' },
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loading: false
    })
}))

const createMockStore = (cartItems: any[] = []) => {
    return configureStore({
    reducer: {
        cart: cartSlice,
    },
    preloadedState: {
        cart: {
        items: cartItems
        }
    }
    })
}

const TestWrapper = ({ children, store = createMockStore() } : { children: React.ReactNode, store?: any }) => (
    <Provider store = {store}>
    <BrowserRouter>
        {children}
    </BrowserRouter>
    </Provider>
)

describe('Header Component - TDD Unit Tests', () => {
    it('renders navigation links correctly for authenticated user', () => {
    render(
        <TestWrapper>
            <Header />
        </TestWrapper>
    )

    expect(screen.getByText('FakeStore E-Commerce')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('displays correct cart item count and updates state', () => {
    const cartItems = [
        { id: 1, title: 'Product 1', price: 10, image: 'url1', quantity: 2 },
        { id: 2, title: 'Product 2', price: 20, image: 'url2', quantity: 1 }
    ]
    const mockStore = createMockStore(cartItems)

    render(
        <TestWrapper store = {mockStore}>
            <Header />
        </TestWrapper>
    )

    expect(screen.getByText('Cart (3)')).toBeInTheDocument()
    })

    it('handles navigation clicks and user interactions', () => {
    const mockStore = createMockStore()
    
    render(
        <TestWrapper store={mockStore}>
            <Header />
        </TestWrapper>
    )

    const homeLink = screen.getByText('Home')
    const cartLink = screen.getByText(/Cart/)
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(cartLink).toHaveAttribute('href', '/cart')

    fireEvent.click(homeLink)
    fireEvent.click(cartLink)
    
    expect(homeLink).toBeInTheDocument()
    expect(cartLink).toBeInTheDocument()
  })

  it('displays empty cart state correctly', () => {
    const mockStore = createMockStore([])

    render(
        <TestWrapper store = {mockStore}>
            <Header />
        </TestWrapper>
    )

    expect(screen.getByText('Cart (0)')).toBeInTheDocument()
  })

  it('renders responsive layout elements', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('header')
  })
})

describe('Header Component - Unauthenticated State', () => {
  vi.mock('../hooks/useFirebaseAuth', () => ({
    default: () => ({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false
    })
  }))

  it('shows login link when user is not authenticated', () => {
    vi.doMock('../hooks/useFirebaseAuth', () => ({
      default: () => ({
        user: null,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loading: false
      })
    }))

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    expect(screen.queryByText('Login')).toBeInTheDocument()
  })
})