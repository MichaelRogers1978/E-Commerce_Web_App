import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { clearCart } from '../../store/cartSlice';
import type { RootState } from '../../store';

interface OrderFormData {
  customerName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface OrderFormProps {
  onOrderComplete?: () => void;
}

export default function OrderForm({ onOrderComplete }: OrderFormProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const { user, isAuthenticated } = useFirebaseAuth();

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isAuthenticated || !user) {
      setError('You must be logged in to place an order');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        customer: formData,
        items: cartItems,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      dispatch(clearCart());
      sessionStorage.removeItem("cart");
      
      alert('Order placed successfully!');
      
      setFormData({
        customerName: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
      });

      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className = "order-form">
      <h2>Place Your Order</h2>
      
      <div className = "order-summary">
        <h3>Order Summary</h3>
        <p>Items: {cartItems.length}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>

      <form onSubmit = {handleSubmit}>
        <div>
          <label htmlFor = "customerName">Full Name:</label>
          <input
            id = "customerName"
            type = "text"
            value = {formData.customerName}
            onChange = {(e) => handleInputChange('customerName', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor = "email">Email:</label>
          <input
            id = "email"
            type = "email"
            value = {formData.email}
            onChange = {(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="address">Address:</label>
          <input
            id = "address"
            type = "text"
            value = {formData.address}
            onChange = {(e) => handleInputChange('address', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor = "city">City:</label>
          <input
            id = "city"
            type = "text"
            value = {formData.city}
            onChange = {(e) => handleInputChange('city', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            id = "zipCode"
            type = "text"
            value = {formData.zipCode}
            onChange = {(e) => handleInputChange('zipCode', e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type = "submit" disabled={loading || cartItems.length === 0} className = "button">
          {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
