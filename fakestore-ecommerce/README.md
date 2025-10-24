# FakeStore E-Commerce App #

A modern React e-commerce application built with TypeScript, Redux Toolkit, and TanStack Query. This application uses the FakeStore API to display products and provides a complete shopping cart experience with Auth0 authentication.

# Features #

- Product Catalog: Browse products from various categories
- Shopping Cart: Add, remove, and update product quantities
- Category Filtering: Filter products by category
- Responsive Design: Mobile-friendly interface
- Authentication: Auth0 integration for user authentication
- State Management: Redux Toolkit for cart state management
- Data Fetching: TanStack Query for efficient API calls
- Fallback Data: Graceful handling of API failures with fallback products
- Session Persistence: Cart data persists across browser sessions

# Tech Stack #

- Frontend: React 19, TypeScript
- Build Tool: Vite
- State Management: Redux Toolkit
- Data Fetching: TanStack Query (React Query)
- Routing: React Router DOM
- HTTP Client: Axios
- Authentication: Auth0
- Styling: CSS3
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
   
   # Auth0 Configuration #
   VITE_AUTH0_DOMAIN = your-auth0-domain
   VITE_AUTH0_CLIENT_ID = your-auth0-client-id
   
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

- Development: 'npm run dev' - Starts the development server
- Build: 'npm run build' - Creates a production build
- Preview: 'npm run preview' - Preview the production build
- Lint: 'npm run lint' - Run ESLint checks

# Navigating the App #

1. Home Page (`/`): Browse all products and filter by category
2. Cart Page (`/cart`): View and manage items in your shopping cart
3. Checkout Page (`/checkout`): Complete your purchase

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

# Project Structure #

src/
├── api/                 # API integration
│   └── fakestore.ts    # FakeStore API functions
├── components/         # Reusable components
│   ├── CartItem.tsx    # Individual cart item component
│   ├── Header.tsx      # Navigation header
│   ├── NetworkStatus.tsx # Network connectivity status
│   └── ProductCard.tsx # Product display component
├── config/             # Configuration files
│   └── index.ts        # Environment configuration
├── pages/              # Page components
│   ├── CartPage.tsx    # Shopping cart page
│   ├── CheckoutPage.tsx # Checkout page
│   └── Home.tsx        # Main product listing page
├── store/              # Redux store configuration
│   ├── cartSlice.ts    # Cart state management
│   └── index.ts        # Store configuration
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── queryClient.ts      # TanStack Query configuration

# Configuration #

# Environment Variables #

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | FakeStore API base URL | 'https://fakestoreapi.com' | No |
| `VITE_AUTH0_DOMAIN` | Auth0 domain | - | Yes |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID | - | Yes |
| `VITE_APP_NAME` | Application name | `FakeStore E-Commerce` | No |
| `VITE_ENABLE_SEARCH` | Enable search functionality | `true` | No |
| `VITE_ITEMS_PER_PAGE` | Products per page | `12` | No |
| `VITE_MAX_CART_ITEMS` | Maximum items in cart | `99` | No |

# Auth0 Setup #

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new Single Page Application
3. Configure the following settings:
   - Allowed Callback URLs: 'http://localhost:5173'
   - Allowed Logout URLs: 'http://localhost:5173'
   - Allowed Web Origins: 'http://localhost:5173'
4. Copy your Domain and Client ID to the '.env' file

# Shopping Cart Features #

- Add to Cart: Add products with automatic quantity management
- Update Quantities: Increase/decrease item quantities
- Remove Items: Remove individual items from cart
- Clear Cart: Remove all items at once
- Session Persistence: Cart contents saved to sessionStorage
- Total Calculation: Automatic price calculation with tax/shipping

# Development Notes #

# State Management #

- Redux Toolkit: Manages cart state with automatic serialization
- TanStack Query: Handles API state, caching, and background updates
- Session Storage: Persists cart data across browser sessions

### Performance Optimizations

- React Compiler: Enabled for automatic memoization
- Code Splitting: Lazy loading for optimal bundle sizes
- Query Caching: Efficient data fetching with TanStack Query
- Debounced Updates: Smooth user interactions

# Error Boundaries #

The application includes comprehensive error handling:

- API failure recovery with fallback data
- Network status monitoring
- Graceful degradation of features
- User-friendly error messages

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
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Auth0 Documentation](https://auth0.com/docs)
- [Vite Documentation](https://vitejs.dev/)
