import api from './api';

export const getAllPayments = async () => {
    try {
        const response = await api.get('/payments');
        return response.data;
    } catch (error) {
        console.error("Ödemeler çekilirken hata oluştu:", error);
        throw error;
    }
};