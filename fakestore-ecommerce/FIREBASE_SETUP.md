# Firebase Setup Guide

## What's Configured

Your Firebase project is now set up with the following services:

### 1. **Firebase Authentication**
- Email/password authentication
- User state management
- Custom auth hook (`useFirebaseAuth`)

### 2. **Firestore Database**
- Cloud document database
- Cart synchronization for logged-in users
- Real-time data updates

### 3. **Firebase Storage**
- File upload capabilities
- Image storage for products/users

## Files Created

### Configuration
- `src/config/firebase.ts` - Firebase initialization
- `src/hooks/useFirebaseAuth.ts` - Authentication hook
- `src/services/cartService.ts` - Cart synchronization service
- `src/components/FirebaseAuth.tsx` - Login/signup component

### Environment Variables Added
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Use

### 1. **Basic Authentication**
```tsx
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

function MyComponent() {
  const { user, signIn, signUp, logout, isAuthenticated } = useFirebaseAuth();
  
  if (isAuthenticated) {
    return <div>Welcome {user?.email}</div>;
  }
  
  return <button onClick={() => signIn('email', 'password')}>Sign In</button>;
}
```

### 2. **Cart Synchronization**
```tsx
import { cartService } from '../services/cartService';

// Save cart when user logs in
if (user?.uid) {
  await cartService.saveCart(user.uid, cartItems);
}

// Load cart when user logs in
const savedCart = await cartService.loadCart(user.uid);
```

### 3. **Firestore Database Operations**
```tsx
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Add document
await addDoc(collection(db, 'orders'), {
  userId: user.uid,
  items: cartItems,
  total: totalPrice,
  createdAt: new Date()
});

// Get documents
const querySnapshot = await getDocs(collection(db, 'orders'));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
```

## Integration Options

### Option 1: Replace Auth0 with Firebase Auth
- Remove Auth0 dependencies
- Update Header component to use FirebaseAuth
- Update main.tsx to remove Auth0Provider

### Option 2: Use Both (Recommended)
- Keep Auth0 for social login (Google, Facebook, etc.)
- Use Firebase for database and storage
- Sync user data between both systems

### Option 3: Firebase Only
- Use Firebase Auth for all authentication
- Use Firestore for cart persistence
- Use Firebase Storage for file uploads

## Next Steps

1. **Enable Authentication Methods** in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Optional: Enable Google, Facebook, etc.

2. **Set up Firestore Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /carts/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /orders/{orderId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Test the Setup**:
   - Start your dev server: `npm run dev`
   - Import and use the FirebaseAuth component
   - Test sign up, sign in, and logout functionality

## Firebase Console
- **Project**: e-commerce-web-app-53dd6
- **Console URL**: https://console.firebase.google.com/project/e-commerce-web-app-53dd6

## Troubleshooting

### Common Issues:
1. **"Firebase not initialized"** - Check environment variables
2. **"Permission denied"** - Update Firestore security rules
3. **"Auth domain not authorized"** - Add your domain to Firebase Auth settings

### Debug Mode:
Enable debug logging in your .env:
```env
VITE_DEBUG_MODE=true
VITE_ENABLE_LOGGING=true
```