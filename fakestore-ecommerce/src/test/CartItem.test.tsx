import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CartItem from '../components/CartItem'
import cartSlice, { removeFromCart, updateQuantity } from '../store/cartSlice'

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

const TestWrapper = ({ children, store } : { children: React.ReactNode, store: any }) => (
    <Provider store = {store}>
        {children}
    </Provider>
)

const mockCartItem = {
    id: 1,
    title: "Test Product",
    price: 29.99,
    image: "https://example.com/test-image.jpg",
    quantity: 2
}

describe('CartItem Component - TDD Unit Tests', () => {
    it('renders cart item information correctly', () => {
    const mockStore = createMockStore([mockCartItem])
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg')
    })

    it('displays price and quantity correctly', () => {
    const mockStore = createMockStore([mockCartItem])
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('handles quantity increment user interaction', () => {
    const mockStore = createMockStore([mockCartItem])
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    const incrementButton = screen.getByRole('button', { name: '+' })
    expect(incrementButton).toBeInTheDocument()
    
    fireEvent.click(incrementButton)
    
    expect(dispatchSpy).toHaveBeenCalledWith(
        updateQuantity({ id: 1, quantity: 3 })
    )
    })

    it('handles quantity decrement user interaction', () => {
    const mockStore = createMockStore([mockCartItem])
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    const decrementButton = screen.getByRole('button', { name: '-' })
    expect(decrementButton).toBeInTheDocument()
    
    fireEvent.click(decrementButton)
    
    expect(dispatchSpy).toHaveBeenCalledWith(
        updateQuantity({ id: 1, quantity: 1 })
    )
    })

    it('handles remove item user interaction', () => {
    const mockStore = createMockStore([mockCartItem])
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    const removeButton = screen.getByRole('button', { name: /remove/i })
    expect(removeButton).toBeInTheDocument()
    
    fireEvent.click(removeButton)
    
    expect(dispatchSpy).toHaveBeenCalledWith(
        removeFromCart(1)
    )
    })

    it('disables decrement button when quantity is 1', () => {
    const singleQuantityItem = { ...mockCartItem, quantity: 1 }
    const mockStore = createMockStore([singleQuantityItem])
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {singleQuantityItem} />
        </TestWrapper>
    )

    const decrementButton = screen.getByRole('button', { name: '-' })
    expect(decrementButton).toBeDisabled()
    })

    it('renders with different quantities correctly', () => {
    const highQuantityItem = { ...mockCartItem, quantity: 5 }
    const mockStore = createMockStore([highQuantityItem])
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {highQuantityItem} />
        </TestWrapper>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    })

    it('displays proper button accessibility attributes', () => {
    const mockStore = createMockStore([mockCartItem])
    
    render(
        <TestWrapper store = {mockStore}>
            <CartItem item = {mockCartItem} />
        </TestWrapper>
    )

    const incrementButton = screen.getByRole('button', { name: '+' })
    const decrementButton = screen.getByRole('button', { name: '-' })
    const removeButton = screen.getByRole('button', { name: /remove/i })
    
    expect(incrementButton).toBeEnabled()
    expect(decrementButton).toBeEnabled()
    expect(removeButton).toBeEnabled()
  })
})