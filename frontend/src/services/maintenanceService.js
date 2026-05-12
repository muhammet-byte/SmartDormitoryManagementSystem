import api from './api';

// YÖNETİCİ: Tüm arıza ve şikayetleri getirir
export const getAllMaintenanceRequests = async () => {
    const response = await api.get('/maintenance');
    return response.data;
};

// YÖNETİCİ: Talebin durumunu günceller (Çözüldü/İptal)
export const updateMaintenanceStatus = async (id, statusData) => {
    const response = await api.put(`/maintenance/${id}/status`, statusData);
    return response.data;
};

// ÖĞRENCİ: Yeni bir arıza talebi oluşturur
export const createMaintenanceRequest = async (requestData) => {
    try {
        const response = await api.post('/maintenance', requestData);
        return response.data;
    } catch (error) {
        console.error("Talep oluşturulurken hata oluştu:", error);
        throw error;
    }
};

// ÖĞRENCİ: Öğrencinin geçmiş arıza taleplerini getirir
export const getStudentMaintenanceRequests = async (userId) => {
    const response = await api.get(`/maintenance/student/${userId}`);
    return response.data;
};