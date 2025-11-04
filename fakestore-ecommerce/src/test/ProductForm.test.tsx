import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, test, expect } from 'vitest';
import ProductForm from '../components/forms/ProductForm';
import cartSlice from '../store/cartSlice';

vi.mock('../config/firebaseConfig', () => ({
  db: {},
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' }))
}));

const mockStore = configureStore({
  reducer: {
    cart: cartSlice
  }
});

describe('ProductForm Component', () => {
  test('renders all form fields', () => {
    render(
      <Provider store={mockStore}>
        <ProductForm />
      </Provider>
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  test('updates input values when user types', () => {
    render(
      <Provider store = {mockStore}>
        <ProductForm />
      </Provider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Product' } });
    
    expect(titleInput).toHaveValue('Test Product');
  });

  test('shows validation error for empty required fields', async () => {
    render(
      <Provider store = {mockStore}>
        <ProductForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });
});