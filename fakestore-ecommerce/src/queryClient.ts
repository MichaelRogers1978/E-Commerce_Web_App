import { QueryClient } from '@tanstack/react-query';

const staleTime = (Number(import.meta.env.VITE_QUERY_STALE_TIME) || 2) * 60 * 1000;
const gcTime = (Number(import.meta.env.VITE_QUERY_CACHE_TIME) || 5) * 60 * 1000;

const queryClient = new QueryClient({
    defaultOptions: { 
        queries: {
            staleTime,
            gcTime,
            refetchOnWindowFocus: false,
        },
    },
});

export default queryClient;