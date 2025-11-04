import { useState } from 'react';
import AddDataForm from '../components/forms/AddDataForm';
import DisplayData from '../components/forms/DisplayData';

export default function DataManagementPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
};

    return (
    <div className = "container">
        <h1>Data Management</h1>

    <div style = {{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
        <section>
            <h2>Add New Data</h2>
            <AddDataForm />
        <button 
            onClick = {handleRefresh} 
            className = "button"
            style = {{ marginTop: '1rem' }}
        >
            Refresh Data Display
        </button>
        </section>
        
        <section>
            <DisplayData 
            key = {refreshKey} 
            collectionName = "your-collection-name" 
            title = "Your Data Collection"
            />
        </section>
        </div>
    </div>
    );
}