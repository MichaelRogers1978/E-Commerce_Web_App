import axios from 'axios';

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

const fallbackCategories = ["electronics", "clothing", "books", "home"];

export const fetchAllProducts = async () => {
    try {
        console.log('Fetching products from:', `${BASE_URL}/products`);
        const res = await apiClient.get(`${BASE_URL}/products`);
        return res.data;
    } catch (error) {
        console.error('API Error fetching products:', error);
        console.log('Using fallback products data');
        return fallbackProducts;
    }
};

export const fetchCategories = async () => {
    try {
        console.log('Fetching categories from:', `${BASE_URL}/products/categories`);
        const res = await apiClient.get(`${BASE_URL}/products/categories`);
        return res.data;
    } catch (error) {
        console.error('API Error fetching categories:', error);
        console.log('Using fallback categories data');
        return fallbackCategories;
    }
};

export const fetchProductsByCategory = async (category: string) => {
    try {
        console.log('Fetching products by category from:', `${BASE_URL}/products/category/${category}`);
        const res = await apiClient.get(`${BASE_URL}/products/category/${category}`);
        return res.data;
    } catch (error) {
        console.error('API Error fetching products by category:', error);
        console.log('Using filtered fallback products data');
        return fallbackProducts.filter(product => product.category === category);
    }
};