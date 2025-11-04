import { useState } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

export default function FirebaseAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, loading, error, signIn, signUp, logout, isAuthenticated } = useFirebaseAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      signUp(email, password);
    } else {
      signIn(email, password);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="firebase-auth">
        <span>Welcome, {user.email}</span>
        <button 
          className="button small" 
          onClick={logout}
          style={{ marginLeft: '8px' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className = "firebase-auth">
      <form onSubmit = {handleSubmit} style = {{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type = "email"
          placeholder = "Email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          required
          style = {{ padding: '4px', fontSize: '12px' }}
        />
        <input
          type = "password"
          placeholder = "Password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required
          style = {{ padding: '4px', fontSize: '12px' }}
        />
        <button type = "submit" className="button small">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button 
          type = "button" 
          className = "button small"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
        </button>
      </form>
      {error && (
        <div style = {{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}