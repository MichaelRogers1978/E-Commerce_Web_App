import axios from 'axios';
import { fetchAllProductsFromFirestore } from '../services/productService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

const apiClient = axios.create({
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'E-Commerce-App/1.0.0'
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        
        if (!config._retry && (error.code === 'NETWORK_ERROR' || (error.response?.status >= 500))) {
            config._retry = true;
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            return apiClient(config);
        }
        
        return Promise.reject(error);
    }
);

const fallbackProducts = [
    {
        id: 1,
        title: "Sample Product 1",
        price: 29.99,
        category: "electronics",
        description: "This is a sample product description.",
        image: "https://via.placeholder.com/300x300?text=Product+1",
        rating: { rate: 4.5, count: 120 }
    },
    {
        id: 2,
        title: "Sample Product 2", 
        price: 39.99,
        category: "clothing",
        description: "This is another sample product description.",
        image: "https://via.placeholder.com/300x300?text=Product+2",
        rating: { rate: 4.2, count: 89 }
    },
    {
        id: 3,
        title: "Sample Product 3",
        price: 19.99,
        category: "books",
        description: "Sample book product description.",
        image: "https://via.placeholder.com/300x300?text=Product+3",
        rating: { rate: 4.8, count: 203 }
    }
];

export const fetchAllProducts = async () => {
    console.log('🚀 Starting hybrid product fetch...');
    const allProducts = [];
    
    // Step 1: Load FakeStore API products first
    try {
        console.log('📡 Fetching products from FakeStore API...', BASE_URL);
        console.log('🔗 Full API URL:', `${BASE_URL}/products`);
        
        // Test API connectivity first
        const res = await apiClient.get(`${BASE_URL}/products`);
        const apiProducts = res.data;
        
        console.log('✅ FakeStore API Response:', apiProducts?.length, 'products received');
        
        if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
            const processedApiProducts = apiProducts.map((product: any) => ({
                ...product,
                firestoreId: null // Mark as API products
            }));
            
            allProducts.push(...processedApiProducts);
            console.log(`✅ Added ${apiProducts.length} products from FakeStore API`);
        } else {
            throw new Error('No products received from API');
        }
    } catch (apiError) {
        console.error('❌ FakeStore API failed:', apiError);
        console.log('🔄 Using fallback products instead...');
        
        // Use fallback products if API fails
        const processedFallbackProducts = fallbackProducts.map(product => ({
            ...product,
            firestoreId: null
        }));
        allProducts.push(...processedFallbackProducts);
        console.log(`✅ Added ${fallbackProducts.length} fallback products`);
    }
    
    // Step 2: Add custom Firestore products
    try {
        console.log('🔥 Fetching custom products from Firestore...');
        const firestoreProducts = await fetchAllProductsFromFirestore();
        
        if (firestoreProducts && firestoreProducts.length > 0) {
            const processedFirestoreProducts = firestoreProducts.map(product => ({
                ...product,
                id: product.id > 1000 ? product.id : product.id + 1000 
            }));
            
            allProducts.push(...processedFirestoreProducts);
            console.log(`✅ Added ${firestoreProducts.length} custom products from Firestore`);
        } else {
            console.log('ℹ️ No custom products found in Firestore');
        }
    } catch (firestoreError) {
        console.error('⚠️ Firestore fetch error (this is okay):', firestoreError);
    }
    
    console.log(`🎯 FINAL RESULT: ${allProducts.length} total products loaded`);
    console.log('📊 Products breakdown:', allProducts.map(p => `${p.id}: ${p.title.substring(0,30)}...`));
    return allProducts;
};

export const fetchCategories = async () => {
    const allProducts = await fetchAllProducts();
    const allCategories = Array.from(new Set(allProducts.map((product: any) => product.category)));
    
    console.log(`Total categories found: ${allCategories.length}`, allCategories);
    return allCategories;
};

export const fetchProductsByCategory = async (category: string) => {
    const allProducts = await fetchAllProducts();
    const categoryProducts = allProducts.filter((product: any) => product.category === category);
    
    console.log(`Found ${categoryProducts.length} products in category "${category}"`);
    return categoryProducts;
};