import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchJobSuggestions = async (limit = 10) => {
  try {
    const { data } = await api.get(`/products?limit=${limit}`);
    // Map product data to job-like suggestions for company/role autocomplete
    return data.products.map(p => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      category: p.category,
    }));
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
};

export default api;
