import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface DataItem {
    id: string;
    [key: string]: any;
}

interface DisplayDataProps {
    collectionName: string;
    title?: string;
}

export default function DisplayData({ collectionName, title = "Data" }: DisplayDataProps) {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<{[key: string]: any}>({});

    const fetchData = async () => {
    try {
        setLoading(true);
        setError(null);

    const querySnapshot = await getDocs(collection(db, collectionName));
    const fetchedData: DataItem[] = [];

    querySnapshot.forEach((doc) => {
        fetchedData.push({
            id: doc.id,
            ...doc.data()
        });
    });

    setData(fetchedData);
    } catch (err: any) {
    setError(err.message);
        console.error('Error fetching data:', err);
    } finally {
        setLoading(false);
    }
};

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        await deleteDoc(doc(db, collectionName, id));
        setData(data.filter(item => item.id !== id));
        alert('Item has been deleted successfully!');
    } catch (err: any) {
        setError(err.message);
        console.error('Error deleting data:', err);
    }
};

const handleEdit = (item: DataItem) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
};

const handleUpdate = async (id: string) => {
    try {
        const { id: itemId, ...updateData } = editFormData;
        await updateDoc(doc(db, collectionName, id), updateData);
        
        setData(data.map(item => 
            item.id === id ? { ...item, ...updateData } : item
        ));
        
        setEditingId(null);
        setEditFormData({});
        alert('Item updated successfully!');
    } catch (err: any) {
        setError(err.message);
        console.error('Error updating data:', err);
    }
};

const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
};

const handleInputChange = (key: string, value: any) => {
    setEditFormData(prev => ({
        ...prev,
        [key]: value
    }));
};


const handleRefresh = () => {
    fetchData();
};

useEffect(() => {
    fetchData();
}, [collectionName]);

    if (loading) {
    return <div className = "loading">Loading {title.toLowerCase()}...</div>;
}

    if (error) {
    return (
        <div className = "error">
        <p>Error loading data: {error}</p>
        <button onClick = {handleRefresh} className = "button small">
            Try Again
        </button>
        </div>
    );
}

return (
    <div className = "display-data">
        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>{title}</h2>
        <button onClick = {handleRefresh} className = "button small">
            Refresh
        </button>
    </div>

    {data.length === 0 ? (
        <p>No data was found in {collectionName} collection.</p>
    ) : (
        <div className = "data-grid">
            {data.map((item) => (
            <div key = {item.id} className = "data-item" style = {{ 
                border: '1px solid #ddd', 
                padding: '1rem', 
                margin: '0.5rem 0',
                borderRadius: '4px'
            }}>
                {editingId === item.id ? (
                    <div>
                        <h4>Editing Item</h4>
                        {Object.entries(item).map(([key, value]) => {
                            if (key === 'id') return null;
                            
                            return (
                                <div key = {key} style = {{ marginBottom: '0.5rem' }}>
                                    <label style = {{ display: 'block', fontWeight: 'bold' }}>
                                        {key}:
                                    </label>
                                    <input
                                        type = {typeof value === 'number' ? 'number' : 'text'}
                                        value = {editFormData[key] || ''}
                                        onChange = {(e) => handleInputChange(key, 
                                            typeof value === 'number' 
                                                ? Number(e.target.value) 
                                                : e.target.value
                                        )}
                                        style = {{ 
                                            width: '100%', 
                                            padding: '4px', 
                                            marginBottom: '8px' 
                                        }}
                                    />
                                </div>
                            );
                        })}
                        <div style = {{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                            <button 
                                onClick = {() => handleUpdate(item.id)}
                                className = "button small"
                                style={{ backgroundColor: '#28a745', color: 'white' }}
                            >
                                Save
                            </button>
                            <button 
                                onClick = {handleCancelEdit}
                                className = "button small"
                                style = {{ backgroundColor: '#6c757d', color: 'white' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style = {{ flex: 1 }}>
                            {Object.entries(item).map(([key, value]) => {
                            if (key === 'id') return null;
                            
                            return (
                            <div key = {key} style = {{ marginBottom: '0.5rem' }}>
                                <strong>{key}:</strong> {
                                    typeof value === 'object' 
                                    ? JSON.stringify(value) 
                                    : String(value)
                                }
                            </div>
                            );
                        })}
                        <small style = {{ color: '#666' }}>ID: {item.id}</small>
                        </div>
                        
                        <div style = {{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '1rem' }}>
                            <button 
                                onClick = {() => handleEdit(item)}
                                className = "button small"
                                style = {{ 
                                    backgroundColor: '#007bff', 
                                    color: 'white'
                                }}
                            >
                                Edit
                            </button>
                            <button 
                                onClick = {() => handleDelete(item.id)}
                                className = "button small"
                                style = {{ 
                                backgroundColor: '#ff4444', 
                                color: 'white'
                                }}
                            >
                            Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ))}
        </div>
    )}

    <p style = {{ marginTop: '1rem', color: '#666' }}>
        Total items: {data.length}
    </p>
    </div>
    );
}