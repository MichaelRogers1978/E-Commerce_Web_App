import { useEffect, useState } from 'react';

interface NetworkStatusProps {
    error?: Error | null;
    isLoading?: boolean;
}

export default function NetworkStatus({ error, isLoading }: NetworkStatusProps) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className = "network-status error">
                <h3>🔌 No Internet Connection</h3>
                <p>Please check your internet connection and try again.</p>
            </div>
        );
    }

    if (error) {
        const isAccessDenied = error.message.includes('403') || 
                                error.message.includes('Access denied') ||
                                error.message.includes('blocked');
        
        if (isAccessDenied) {
            return (
                <div className="network-status error">
                    <h3>API Access Temporarily Blocked</h3>
                    <p>The API service has temporarily blocked access. This is usually due to:</p>
                    <ul>
                        <li>Too many requests (rate limiting)</li>
                        <li>Temporary IP blocking</li>
                        <li>Service maintenance</li>
                    </ul>
                    <p><strong>Solution:</strong> The app will automatically use sample data so you can continue testing!</p>
                    <button 
                        className = "button small" 
                        onClick = {() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return (
            <div className = "network-status error">
                <h3>API Error</h3>
                <p>There was a problem connecting to the API:</p>
                <code>{error.message}</code>
                <button 
                    className = "button small" 
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="network-status loading">
                <p>Loading products...</p>
            </div>
        );
    }

    return null;
}