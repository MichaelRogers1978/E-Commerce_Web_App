import { useState, useEffect } from 'react';
import { fetchAllProductsFromFirestore, updateProductInFirestore, deleteProductFromFirestore } from '../services/productService';
import type { Product } from '../types';
import ProductForm from '../components/forms/ProductForm';

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchProducts = async () => {
    try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await fetchAllProductsFromFirestore();
        setProducts(fetchedProducts);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchProducts();
}, []);

    const handleEdit = (product: Product) => {
    setEditingProduct(product);
    };

    const handleUpdate = async (updatedProduct: Product) => {
    if (!updatedProduct.firestoreId) return;
    
    try {
    await updateProductInFirestore(updatedProduct.firestoreId, updatedProduct);
        await fetchProducts();
        setEditingProduct(null);
        alert('Product updated successfully!');
    } catch (err: any) {
        setError(err.message);
    }
};

const handleDelete = async (product: Product) => {
    if (!product.firestoreId) return;
    
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    try {
        await deleteProductFromFirestore(product.firestoreId);
        await fetchProducts();
        alert('Product deleted successfully!');
    } catch (err: any) {
        setError(err.message);
    }
};

const handleProductAdded = () => {
    fetchProducts(); 
    setShowAddForm(false);
};

if (loading) {
    return <div className = "container"><p>Loading products...</p></div>;
}

return (
    <div className = "container">
        <h1>Product Management</h1>
    
        {error && <div style = {{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

    <div style = {{ marginBottom: '2rem' }}>
        <button 
            className = "button" 
            onClick = {() => setShowAddForm(!showAddForm)}
        >
            {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
    </div>

    {showAddForm && (
        <div className = "add-product-container">
            <ProductForm onProductAdded={handleProductAdded} />
        </div>
    )}

    {editingProduct && (
        <EditProductForm 
            product = {editingProduct}
            onUpdate = {handleUpdate}
            onCancel = {() => setEditingProduct(null)}
        /> 
    )}

    <div className = "products-grid">
        {products.length === 0 ? (
            <p>No products found. Add some products to get started!</p>
        ) : (
            products.map((product) => (
            <div key = {product.firestoreId} className = "card">
                <img src = {product.image} alt = {product.title} />
                <h3>{product.title}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p>{product.description.slice(0, 100)}...</p>
                <div style = {{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button 
                    className = "button small" 
                    onClick = {() => handleEdit(product)}
                    style = {{ backgroundColor: '#007bff' }}
                >
                    Edit
                </button>
                <button 
                    className = "button small" 
                    onClick = {() => handleDelete(product)}
                    style = {{ backgroundColor: '#dc3545' }}
                >
                    Delete
                </button>
                </div>
            </div>
        ))
        )}
    </div>
    </div>
    );
}

interface EditProductFormProps {
    product: Product;
    onUpdate: (product: Product) => void;
    onCancel: () => void;
}

function EditProductForm({ product, onUpdate, onCancel }: EditProductFormProps) {
    const [formData, setFormData] = useState({
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.image
    });

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
        ...product,
        ...formData
    });
};

const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
};

return (
    <div style = {{ backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Edit Product</h2>
        <form onSubmit = {handleSubmit}>
        <div style = {{ marginBottom: '1rem' }}>
            <label htmlFor = "edit-title">Product Title:</label>
            <input
            id = "edit-title"
            type = "text"
            value = {formData.title}
            onChange = {(e) => handleInputChange('title', e.target.value)}
            required
            style = {{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="edit-price">Price:</label>
            <input
            id = "edit-price"
            type = "number"
            step = "0.01"
            value = {formData.price}
            onChange = {(e) => handleInputChange('price', parseFloat(e.target.value))}
            required
            style = {{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        </div>

        <div style = {{ marginBottom: '1rem' }}>
            <label htmlFor = "edit-category">Category:</label>
            <select
            id = "edit-category"
            value = {formData.category}
            onChange = {(e) => handleInputChange('category', e.target.value)}
            required
            style = {{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        >
            <option value = "electronics">Electronics</option>
            <option value = "clothing">Clothing</option>
            <option value = "books">Books</option>
            <option value = "home">Home</option>
            </select>
        </div>

        <div style = {{ marginBottom: '1rem' }}>
            <label htmlFor = "edit-description">Description:</label>
            <textarea
            id = "edit-description"
            value = {formData.description}
            onChange = {(e) => handleInputChange('description', e.target.value)}
            required
            style = {{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', minHeight: '100px' }}
        />
        </div>

        <div style = {{ marginBottom: '1rem' }}>
            <label htmlFor = "edit-image">Image URL:</label>
            <input
            id = "edit-image"
            type = "url"
            value = {formData.image}
            onChange = {(e) => handleInputChange('image', e.target.value)}
            required
            style = {{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        </div>

        <div style = {{ display: 'flex', gap: '1rem' }}>
            <button type = "submit" className="button">Update Product</button>
            <button type = "button" className="button" onClick={onCancel} style={{ backgroundColor: '#6c757d' }}>
            Cancel
            </button>
        </div>
        </form>
    </div>
    );
}