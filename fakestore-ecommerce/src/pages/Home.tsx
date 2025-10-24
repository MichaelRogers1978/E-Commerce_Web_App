import { useQuery } from "@tanstack/react-query";
import {
    fetchAllProducts, fetchCategories,
    fetchProductsByCategory 
} from "../api/fakestore";
import ProductCard from "../components/ProductCard";
import NetworkStatus from "../components/NetworkStatus";
import { useState } from "react";

export default function Home() {
    const [category, setCategory] = useState("");
    const { data: categories, error: categoriesError } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories
    });
    const { data: products, isLoading, error: productsError } = useQuery({
        queryKey: ["products", category],
        queryFn: () => (category ? fetchProductsByCategory(category) : fetchAllProducts())
    });

    return (
        <div className = "container">
            <h1>Product Catalog</h1>
            
            <NetworkStatus error={productsError || categoriesError} isLoading = {isLoading} />
            
            <select
                className = "select"
                value = {category}
                onChange = {(e) => setCategory(e.target.value)}
            >
                <option value = "">All</option>
                {categories?.map((c: string) => (
                    <option key = {c} value = {c}>
                        {c}
                    </option>
                ))}
            </select>  

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className = "grid">
                    {products?.map((p: any) => (
                        <ProductCard key = {p.id}  product = {p} />
                    ))}
                </div>
            )}     
        </div>
    );
}