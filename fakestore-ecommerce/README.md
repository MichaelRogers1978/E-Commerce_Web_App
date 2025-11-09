# FakeStore E-Commerce App #

A modern React e-commerce application built with TypeScript, Redux Toolkit, TanStack Query, and Firebase. This application uses the FakeStore API to display products and provides a complete shopping cart experience with Firebase authentication, user management, and order history.

 -- Updated with fresh Firebase configuration! --

# Features #

- Product Catalog: Browse products from various categories via FakeStore API
- Shopping Cart: Add, remove, and update product quantities with Firebase sync
- User Authentication: Firebase Authentication with email/password login
- User Profile Management: Complete user profile CRUD operations with account deletion
- Order History: Track and manage user orders with detailed order views  
- Product Management: Admin interface for CRUD operations on products (Firebase-first)
- Cart Synchronization: Automatic cart sync with Firebase for authenticated users
- Category Filtering: Filter products by category
- Responsive Design: Mobile-friendly interface with enhanced visibility
- State Management: Redux Toolkit for cart state management
- Data Fetching: TanStack Query for efficient API calls
- Database Integration: Firestore for products, users, orders, and cart storage
- Fallback Data: Graceful handling of API failures with fallback products
- Session Persistence: Cart data persists across browser sessions

# Tech Stack #

- Frontend: React 19, TypeScript
- Build Tool: Vite
- State Management: Redux Toolkit  
- Data Fetching: TanStack Query (React Query)
- Routing: React Router DOM
- HTTP Client: Axios
- Authentication: Firebase Authentication
- Database: Firestore Database
- Styling: CSS3 with modern features
- Testing: Vitest + React Testing Library
- Linting: ESLint with TypeScript support

# Installation #

1. Clone the repository:
      bash
   git clone <repository-url>
   cd fakestore-ecommerce

2. Install dependencies:
      bash
   npm install

3. Set up environment variables:
   Create a '.env' file in the root directory and add:
      env
   # API Configuration #
   VITE_API_BASE_URL = https://fakestoreapi.com
   
   # Firebase Configuration #
   VITE_FIREBASE_API_KEY = your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = your-project-id
   VITE_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID = your-sender-id
   VITE_FIREBASE_APP_ID = your-app-id
   
   # App Configuration (Optional) #
   VITE_APP_NAME = FakeStore E-Commerce
   VITE_APP_VERSION = 1.0.0
   VITE_APP_ENV = development
   
   # Feature Flags (Optional) #
   VITE_ENABLE_WISHLIST = false
   VITE_ENABLE_REVIEWS = false
   VITE_ENABLE_SEARCH = true
   
   # UI Configuration (Optional) #
   VITE_ITEMS_PER_PAGE = 12
   VITE_MAX_CART_ITEMS = 99
   
   # Debug (Optional) #
   VITE_DEBUG_MODE = false
   VITE_ENABLE_LOGGING = false
   
4. Start the development server:
      bash
   npm run dev

# Usage #

# Running the Application #

- Development: `npm run dev` - Starts the development server
- Build: `npm run build` - Creates a production build  
- Preview: `npm run preview` - Preview the production build
- Test: `npm run test` - Run the test suite
- Lint: `npm run lint` - Run ESLint checks

# Navigating the App #

1. Home Page (`/`): Browse all products and filter by category
2. Authentication (`/auth`): Login or register with Firebase authentication
3. User Profile (`/profile`): Manage user profile, view account details, delete account
4. Cart Page (`/cart`): View and manage items in your shopping cart
5. Checkout Page (`/checkout`): Complete your purchase and create orders
6. Order History (`/orders`): View detailed order history and order management
7. Product Management (`/products`): Admin interface for CRUD operations on products

# Firebase Integration #

# Authentication #

The application uses Firebase Authentication for user management:

- Email/Password Authentication: Secure login and registration
- User State Management: Persistent authentication across sessions
- Protected Routes: Profile, Orders, and Products pages require authentication
- Account Management: Users can update profiles and delete accounts

# Firestore Database #

The application integrates with Firestore for data persistence:

# Collections #

- products: Product catalog with CRUD operations
- users: User profiles and account information  
- orders: Order history and order management
- carts: Cart synchronization for authenticated users

# API Integration #

# FakeStore API #

The application integrates with the [FakeStore API](https://fakestoreapi.com/) to fetch product data:

# Available Endpoints #

- Get All Products: 'GET /products'
- Get Categories: 'GET /products/categories'
- Get Products by Category: 'GET /products/category/{category}'

# API Functions #

The application provides the following API functions in 'src/api/fakestore.ts':

   typescript
// Fetch all products
export const fetchAllProducts = async () => Promise<Product[]>

// Fetch all categories
export const fetchCategories = async () => Promise<string[]>

// Fetch products by category
export const fetchProductsByCategory = async (category: string) => Promise<Product[]>

# Error Handling & Fallbacks #

- Automatic Retry: Failed requests are automatically retried once after a 2-second delay
- Fallback Data: If the API is unavailable, the app uses predefined fallback products
- Timeout Handling: Requests timeout after 10 seconds
- Network Error Recovery: Graceful handling of network connectivity issues

# API Configuration #

The API client includes:

- Base URL: Configurable via environment variables
- Timeout: 10-second request timeout
- Headers: JSON content-type and user-agent
- Interceptors: Automatic retry logic for failed requests

# Data Models #

# Product Interface #
   typescript
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

# Cart Item Interface #
   typescript
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

# User Interface #
   typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

# Order Interface #
   typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

# Project Structure #


src/
├── api/                    # API integration
│   └── fakestore.ts       # FakeStore API functions
├── components/            # Reusable components
│   ├── CartItem.tsx       # Individual cart item component
│   ├── Header.tsx         # Navigation header with auth
│   ├── NetworkStatus.tsx  # Network connectivity status
│   ├── ProductCard.tsx    # Product display component
│   ├── auth/              # Authentication components
│   │   ├── FirebaseAuth.tsx  # Firebase auth wrapper
│   │   ├── Login.tsx         # Login form
│   │   └── Register.tsx      # Registration form
│   └── forms/             # Form components
│       ├── ContactForm.tsx   # Contact form
│       ├── OrderForm.tsx     # Order creation form
│       └── ProductForm.tsx   # Product CRUD form
├── config/                # Configuration files
│   ├── firebaseConfig.ts  # Firebase configuration
│   └── index.ts           # Environment configuration
├── hooks/                 # Custom React hooks
│   ├── useFirebaseAuth.ts # Firebase authentication hook
│   └── useCartSync.ts     # Cart Firebase synchronization
├── pages/                 # Page components
│   ├── AuthPage.tsx       # Authentication page
│   ├── CartPage.tsx       # Shopping cart page
│   ├── CheckoutPage.tsx   # Checkout page
│   ├── Home.tsx           # Main product listing page
│   ├── OrderHistory.tsx   # Order history page
│   ├── ProductManagement.tsx # Product CRUD page
│   └── UserProfile.tsx    # User profile management
├── services/              # Service layer
│   └── cartService.ts     # Cart business logic
├── store/                 # Redux store configuration
│   ├── cartSlice.ts       # Cart state management
│   └── index.ts           # Store configuration
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared interfaces and types
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── queryClient.ts         # TanStack Query configuration


# Configuration #

# Environment Variables #

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | FakeStore API base URL | `https://fakestoreapi.com` | No |
| `VITE_FIREBASE_API_KEY` | Firebase API key | - | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | - | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | - | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | - | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | - | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | - | Yes |
| `VITE_APP_NAME` | Application name | `FakeStore E-Commerce` | No |
| `VITE_ENABLE_SEARCH` | Enable search functionality | `true` | No |
| `VITE_ITEMS_PER_PAGE` | Products per page | `12` | No |
| `VITE_MAX_CART_ITEMS` | Maximum items in cart | `99` | No |

# Firebase Setup #

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database with the following collections:
   - products: Product catalog
   - users: User profiles  
   - orders: Order history
   - carts: Cart synchronization
4. Get your Firebase config from Project Settings > General > Your apps
5. Copy the configuration values to your `.env` file
6. Configure Firestore security rules for your collections

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

# Key Features #

# Shopping Cart Features #

- Add to Cart: Add products with automatic quantity management
- Firebase Sync: Cart automatically syncs with Firestore for authenticated users
- Update Quantities: Increase/decrease item quantities with real-time sync
- Remove Items: Remove individual items from cart
- Clear Cart: Remove all items at once
- Session Persistence: Cart contents saved and synced with Firebase
- Total Calculation: Automatic price calculation with tax/shipping
- Protected Cart: Cart data tied to authenticated user accounts

# User Management Features #

- User Registration: Firebase email/password authentication
- User Profiles: Complete profile management with CRUD operations
- Account Deletion: Users can permanently delete their accounts
- Order History: View detailed order history with order management
- Protected Routes: Secure access to profile, orders, and product management

# Product Management Features #

- Product CRUD: Complete product lifecycle management
- Firebase Integration: Products stored in Firestore database
- Category Management: Organize products by categories
- Image Upload: Product image management
- Real-time Updates: Live product updates across the application

# Development Notes #

# State Management #

- Redux Toolkit: Manages cart state with automatic serialization
- TanStack Query: Handles API state, caching, and background updates
- Firebase Integration: Real-time data synchronization with Firestore
- Session Storage: Persists cart data across browser sessions
- Cart Sync Hook: Automatic cart synchronization with Firebase for authenticated users

# Performance Optimizations #

- React Compiler: Enabled for automatic memoization
- Code Splitting: Lazy loading for optimal bundle sizes
- Query Caching: Efficient data fetching with TanStack Query
- Debounced Updates: Smooth user interactions
- Firebase Offline: Offline data persistence with Firestore

# Error Boundaries #

The application includes comprehensive error handling:

- API failure recovery with fallback data
- Network status monitoring and connectivity alerts
- Firebase error handling for authentication and database operations
- Graceful degradation of features
- User-friendly error messages and loading states

# Testing #

The application includes comprehensive testing:

- Unit Tests: Component and utility function testing
- Integration Tests: API and Firebase integration testing
- Test Coverage: Vitest with React Testing Library
- Mocking: Firebase and API mocking for reliable tests

# Contributing #

1. Fork the repository
2. Create a feature branch: 'git checkout -b feature/new-feature'
3. Commit changes: 'git commit -am "Add new feature" '
4. Push to the branch: 'git push origin feature/new-feature'
5. Submit a pull request

# License #

This project is licensed under the MIT License - see the LICENSE file for details.

# Links #

- [FakeStore API Documentation](https://fakestoreapi.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Auth0 Documentation](https://auth0.com/docs)
- [Vite Documentation](https://vitejs.dev/)
# CI/CD Pipeline Ready
# Updated 11/09/2025 11:05:15
# Force redeploy with updated env vars 11/09/2025 11:09:40
# Deploy with updated Vercel env vars 11/09/2025 11:33:48
