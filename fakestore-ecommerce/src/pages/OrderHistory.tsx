import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    customer: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    };
items: Array<{
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    }>;
    total: number;
    status: string;
    createdAt: string;
}

export default function OrderHistory() {
    const { user, isAuthenticated } = useFirebaseAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

useEffect(() => {
    const fetchOrders = async () => {
        if (!user?.uid) {
        setLoading(false);
        return;
    }

    try {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        
        querySnapshot.forEach((doc) => {
            fetchedOrders.push({
            id: doc.id,
            ...doc.data()
            } as Order);
        });
        
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(fetchedOrders);
        } catch (err: any) {
        setError(err.message);
        console.error('Error fetching orders:', err);
        } finally {
        setLoading(false);
        }
    };

    fetchOrders();
    }, [user]);

if (!isAuthenticated) {
    return (
        <div className = "container">
        <h1>Order History</h1>
        <p>Please log in to view your order history.</p>
        </div>
    );
    }

    if (loading) {
    return (
        <div className = "container">
        <h1>Order History</h1>
        <p>Loading your orders...</p>
        </div>
    );
    }

    if (error) {
    return (
        <div className = "container">
            <h1>Order History</h1>
            <div style={{ color: 'red' }}>Error: {error}</div>
        </div>
    );
    }

return (
    <div className = "container">
        <h1>Order History</h1>
    
        {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
        ) : (
        <div>
            <p>You have {orders.length} order(s)</p>
    
        {selectedOrder ? (
            <OrderDetail 
                order = {selectedOrder} 
                onBack = {() => setSelectedOrder(null)} 
            />
            ) : (
            <div className = "orders-list">
                {orders.map((order) => (
                <div 
                    key = {order.id} 
                    className = "order-card"
                    onClick = {() => setSelectedOrder(order)}
                >
                <div className = "order-card-content">
                    <div className = "order-card-info">
                        <h3 className = "order-id">Order #{order.id.slice(-8)}</h3>
                        <p className = "order-text"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className = "order-text"><strong>Status:</strong> <span className = {`order-status order-status-${order.status}`}>{order.status}</span></p>
                        <p className = "order-text"><strong>Items:</strong> {order.items.length}</p>
                    </div>
                    <div className = "order-card-summary">
                        <h3 className = "order-total">${order.total.toFixed(2)}</h3>
                        <button className = "button small">View Details</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    )}
    </div>
);
}

interface OrderDetailProps {
    order: Order;
    onBack: () => void;
}

function OrderDetail({ order, onBack }: OrderDetailProps) {
    return (
    <div>
        <div style = {{ marginBottom: '2rem' }}>
        <button className = "button" onClick = {onBack}>← Back to Orders</button>
    </div>
    
    <div className = "order-detail-card">
        <h2 className = "order-detail-title">Order #{order.id.slice(-8)}</h2>
        
        <div className = "order-detail-grid">
            <div className = "order-info-section">
            <h3 className = "order-section-title">Order Information</h3>
            <p className = "order-detail-text"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className = "order-detail-text"><strong>Status:</strong> <span className = {`order-status order-status-${order.status}`}>{order.status}</span></p>
            <p className = "order-detail-text"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        </div>
        
        <div className = "order-info-section">
            <h3 className = "order-section-title">Shipping Information</h3>
            <p className = "order-detail-text"><strong>Name:</strong> {order.customer.customerName}</p>
            <p className = "order-detail-text"><strong>Email:</strong> {order.customer.email}</p>
            <p className = "order-detail-text"><strong>Address:</strong> {order.customer.address}</p>
            <p className = "order-detail-text"><strong>City:</strong> {order.customer.city}</p>
            <p className = "order-detail-text"><strong>Zip Code:</strong> {order.customer.zipCode}</p>
        </div>
        </div>
        
        <div className = "order-items-section">
            <h3 className = "order-section-title">Items Ordered</h3>
            <div className = "order-items-list">
            {order.items.map((item, index) => (
            <div key = {index} className = "order-item-card">
                <img 
                    src = {item.image} 
                    alt = {item.title}
                    className = "order-item-image"
                />
                <div className = "order-item-info">
                    <h4 className = "order-item-title">{item.title}</h4>
                    <p className = "order-item-detail">Quantity: {item.quantity}</p>
                    <p className = "order-item-detail">Price: ${item.price.toFixed(2)} each</p>
                </div>
                <div className = "order-item-total">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    </div>
    );
}