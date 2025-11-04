import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '../config/firebaseConfig';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useNavigate } from 'react-router-dom';

interface UserData {
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export default function UserProfile() {
    const { user } = useFirebaseAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchUserData = async () => {
        if (!user?.uid) return;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setEditForm({ name: data.name });
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

    fetchUserData();
    }, [user]);

const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
        await updateDoc(doc(db, 'users', user.uid), {
        name: editForm.name,
        updatedAt: new Date().toISOString()
    });
    
        setUserData(prev => prev ? { ...prev, name: editForm.name, updatedAt: new Date().toISOString() } : null);
        setIsEditing(false);
        alert('Profile updated successfully!');
    } catch (err: any) {
        setError(err.message);
    }
};

const handleDeleteAccount = async () => {
    if (!user?.uid) return;
    
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, 'users', user.uid));
    
        await deleteUser(user);
    
        alert('Account deleted successfully');
        navigate('/');
    } catch (err: any) {
        setError(err.message);
    }
};

if (loading) {
    return <div className = "container"><p>Loading profile...</p></div>;
}

if (!userData) {
    return <div className = "container"><p>User profile not found.</p></div>;
}

return (
    <div className = "container">
        <h1>User Profile</h1>
    
        {error && <div style = {{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
    
        <div className = "profile-card">
        {isEditing ? (
            <form onSubmit = {handleUpdateProfile}>
            <div style = {{ marginBottom: '1rem' }}>
                <label htmlFor = "name" className = "profile-label">Name:</label>
                <input
                id = "name"
                type = "text"
                value = {editForm.name}
                onChange = {(e) => setEditForm({ name: e.target.value })}
                required
                style = {{ marginLeft: '1rem', padding: '0.5rem' }}
            />
            </div>
            <div className = "profile-info">
                <strong>Email:</strong> {userData.email} (cannot be changed)
            </div>
            <div style = {{ display: 'flex', gap: '1rem' }}>
                <button type = "submit" className = "button">Save Changes</button>
                <button 
                type = "button" 
                className = "button" 
                onClick = {() => setIsEditing(false)}
                style = {{ backgroundColor: '#6c757d' }}
            >
                Cancel
                </button>
            </div>
            </form>
        ) : (
            <div>
            <p className = "profile-info"><strong>Name:</strong> {userData.name}</p>
            <p className = "profile-info"><strong>Email:</strong> {userData.email}</p>
            <p className = "profile-info"><strong>Member Since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            <p className = "profile-info"><strong>Last Updated:</strong> {new Date(userData.updatedAt).toLocaleDateString()}</p>
            
            <div style = {{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                className = "button" 
                onClick = {() => setIsEditing(true)}
            >
                Edit Profile
                </button>
                <button 
                className = "button" 
                onClick = {handleDeleteAccount}
                style = {{ backgroundColor: '#dc3545' }}
            >
                Delete Account
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
    );
}