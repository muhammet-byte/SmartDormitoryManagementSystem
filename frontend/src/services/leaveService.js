import api from './api';

// YÖNETİCİ: Tüm izinleri getirir (İsmi LeaveRequests.jsx'in beklediği gibi düzelttik!)
export const getAllLeaveRequests = async () => {
    const response = await api.get('/leaves');
    return response.data;
};

// YÖNETİCİ: İzin durumunu günceller (Onay/Red)
export const updateLeaveStatus = async (id, statusData) => {
    const response = await api.put(`/leaves/${id}/status`, statusData);
    return response.data;
};

// YÖNETİCİ: İzin kaydını siler
export const deleteLeaveRequest = async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
};

// ÖĞRENCİ: Yeni bir izin talebi oluşturur
export const createLeaveRequest = async (leaveData) => {
    try {
        const response = await api.post('/leaves', leaveData);
        return response.data;
    } catch (error) {
        console.error("İzin talebi oluşturulurken hata oluştu:", error);
        throw error;
    }
};

// ÖĞRENCİ: Sadece kendi geçmiş izinlerini getirir
export const getStudentLeaves = async (userId) => {
    try {
        const response = await api.get(`/leaves/student/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Geçmiş izinler çekilirken hata oluştu:", error);
        throw error;
    }
};