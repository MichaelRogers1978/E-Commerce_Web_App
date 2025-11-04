import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface ProductFormData {
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface ProductFormProps {
  onProductAdded?: () => void;
}

export default function ProductForm({ onProductAdded }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: 0,
    category: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        createdAt: new Date().toISOString(),
        rating: { rate: 0, count: 0 }
      });
      
      alert('Product added successfully!');
      setFormData({
        title: '',
        price: 0,
        category: '',
        description: '',
        image: ''
      });
      
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className = "product-form">
      <h2>Add New Product</h2>
      <form onSubmit = {handleSubmit}>
        <div>
          <label htmlFor = "title">Product Title:</label>
          <input
            id = "title"
            type = "text"
            value = {formData.title}
            onChange = {(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor = "price">Price:</label>
          <input
            id = "price"
            type = "number"
            step = "0.01"
            value = {formData.price}
            onChange = {(e) => handleInputChange('price', parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label htmlFor = "category">Category:</label>
          <select
            id = "category"
            value = {formData.category}
            onChange = {(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value = "">Select Category</option>
            <option value = "electronics">Electronics</option>
            <option value = "clothing">Clothing</option>
            <option value = "books">Books</option>
            <option value = "home">Home</option>
          </select>
        </div>

        <div>
          <label htmlFor = "description">Description:</label>
          <textarea
            id = "description"
            value = {formData.description}
            onChange = {(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor = "image">Image URL:</label>
          <input
            id = "image"
            type = "url"
            value = {formData.image}
            onChange = {(e) => handleInputChange('image', e.target.value)}
            required
          />
        </div>

        {error && <div className = "error">{error}</div>}

        <button type = "submit" disabled={loading} className="button">
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
