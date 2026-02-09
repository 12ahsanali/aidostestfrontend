import axios from "axios";

// Use local API routes
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
        if (error.response?.status === 401 && !isAuthPage) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

export const signup = async (formData) => {
    try {
        const res = await api.post('/auth/signup', formData);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const login = async (formData) => {
    try {
        const res = await api.post('/auth/login', formData);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export const checkAuth = async () => {
    try {
        const res = await api.get('/auth/check');
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const logout = async () => {
    try {
        const res = await api.post('/auth/logout');
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}