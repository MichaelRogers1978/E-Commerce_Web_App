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
    const allProducts = [];
    
    try {
        console.log('Fetching products from FakeStore API...');
        const res = await apiClient.get(`${BASE_URL}/products`);
        const apiProducts = res.data;
        
        const processedApiProducts = apiProducts.map((product: any) => ({
            ...product,
            firestoreId: null
        }));
        
        allProducts.push(...processedApiProducts);
        console.log(`Loaded ${apiProducts.length} products from FakeStore API`);
    } catch (apiError) {
        console.log('FakeStore API failed, using fallback products...', apiError);
        const processedFallbackProducts = fallbackProducts.map(product => ({
            ...product,
            firestoreId: null
        }));
        allProducts.push(...processedFallbackProducts);
    }
    
    try {
        console.log('Fetching custom products from Firestore...');
        const firestoreProducts = await fetchAllProductsFromFirestore();
        
        if (firestoreProducts.length > 0) {
            const processedFirestoreProducts = firestoreProducts.map(product => ({
                ...product,
                id: product.id > 1000 ? product.id : product.id + 1000 
            }));
            
            allProducts.push(...processedFirestoreProducts);
            console.log(`Added ${firestoreProducts.length} custom products from Firestore`);
        }
    } catch (firestoreError) {
        console.log('No custom products in Firestore (this is fine):', firestoreError);
    }
    
    console.log(`Total products loaded: ${allProducts.length}`);
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