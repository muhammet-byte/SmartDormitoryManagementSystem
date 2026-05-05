import api from './api';

export const getAllMaintenanceRequests = async () => {
    try {
        const response = await api.get('/maintenance');
        return response.data;
    } catch (error) {
        console.error("Bakım talepleri çekilirken hata oluştu:", error);
        throw error;
    }
};

export const updateMaintenanceStatus = async (id, status) => {
    try {
        const response = await api.put(`/maintenance/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Durum güncellenirken hata oluştu:", error);
        throw error;
    }
};

export const createMaintenanceRequest = async (data) => {
    try {
        const response = await api.post('/maintenance', data);
        return response.data;
    } catch (error) {
        console.error("Yeni kayıt oluşturulurken hata oluştu:", error);
        throw error;
    }
};
