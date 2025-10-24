export const config = {
app: {
    name: import.meta.env.VITE_APP_NAME || 'FakeStore E-Commerce',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.VITE_APP_ENV || 'development',
},

api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com',
},

features: {
    wishlist: import.meta.env.VITE_ENABLE_WISHLIST === 'true',
    reviews: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
    search: import.meta.env.VITE_ENABLE_SEARCH !== 'false',
},

ui: {
    itemsPerPage: Number(import.meta.env.VITE_ITEMS_PER_PAGE) || 12,
    maxCartItems: Number(import.meta.env.VITE_MAX_CART_ITEMS) || 99,
},

debug: {
    enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
    logging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
},


auth: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
},

isDevelopment: import.meta.env.DEV,
isProduction: import.meta.env.PROD,
};

export const devLog = (...args: any[]) => {
    if (config.debug.enabled && config.debug.logging) {
    console.log('[DEV]', ...args);
    }
};

export default config;