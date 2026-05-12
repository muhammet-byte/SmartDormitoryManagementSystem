import api from './api';

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error("Admin istatistikleri çekilirken hata oluştu:", error);
        throw error;
    }
};