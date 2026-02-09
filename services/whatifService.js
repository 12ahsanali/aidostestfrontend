import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const submitWhatifAnalysis = async (flightData) => {
    try {
        const res = await api.post('/whatifanalysis/', flightData);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};