const apiHost = import.meta.env.VITE_API_URL;
const API_URL = apiHost ? `https://${apiHost}/api` : 'http://localhost:5000/api';

export default API_URL;
