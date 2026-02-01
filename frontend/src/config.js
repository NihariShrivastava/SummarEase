const apiHost = import.meta.env.VITE_API_URL;
// Use hardcoded production URL if env var is missing or malformed to avoid ERR_NAME_NOT_RESOLVED
const PROD_URL = 'https://summarease-backend-ag0t.onrender.com/api';
const API_URL = import.meta.env.MODE === 'production' ? PROD_URL : 'http://localhost:5000/api';

export default API_URL;
