import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import type { Product } from '../types';

export const fetchAllProductsFromFirestore = async (): Promise<Product[]> => {
    try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
        id: Number(doc.id) || Math.floor(Math.random() * 10000),
        title: data.title || '',
        price: data.price || 0,
        category: data.category || '',
        description: data.description || '',
        image: data.image || '',
        rating: data.rating || { rate: 0, count: 0 },
        firestoreId: doc.id 
        });
    });
    
    return products;
    } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
    }
};

export const fetchCategoriesFromFirestore = async (): Promise<string[]> => {
    try {
    const products = await fetchAllProductsFromFirestore();
    const categories = Array.from(new Set(products.map(product => product.category)));
    return categories;
    } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
    throw error;
    }
};

export const fetchProductsByCategoryFromFirestore = async (category: string): Promise<Product[]> => {
    try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
        id: Number(doc.id) || Math.floor(Math.random() * 10000),
        title: data.title || '',
        price: data.price || 0,
        category: data.category || '',
        description: data.description || '',
        image: data.image || '',
        rating: data.rating || { rate: 0, count: 0 },
        firestoreId: doc.id
        });
    });
    
    return products;
    } catch (error) {
    console.error('Error fetching products by category from Firestore:', error);
    throw error;
    }
};

export const updateProductInFirestore = async (firestoreId: string, productData: Partial<Product>) => {
    try {
    await updateDoc(doc(db, 'products', firestoreId), {
        ...productData,
        updatedAt: new Date().toISOString()
    });
    } catch (error) {
    console.error('Error updating product in Firestore:', error);
    throw error;
    }
};

export const deleteProductFromFirestore = async (firestoreId: string) => {
    try {
    await deleteDoc(doc(db, 'products', firestoreId));
    } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
    }
};