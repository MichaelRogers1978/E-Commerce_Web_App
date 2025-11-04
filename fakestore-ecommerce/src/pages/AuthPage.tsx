import { useState } from 'react';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className = "container">
      <div style = {{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
        <div style = {{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            className = {`button ${isLogin ? '' : 'secondary'}`}
            onClick = {() => setIsLogin(true)}
            style = {{ marginRight: '1rem' }}
          >
            Sign In
          </button>
          <button 
            className = {`button ${!isLogin ? '' : 'secondary'}`}
            onClick = {() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
}