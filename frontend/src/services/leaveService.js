import api from './api';

export const getAllLeaveRequests = async () => {
    try {
        const response = await api.get('/leaves');
        return response.data;
    } catch (error) {
        console.error("İzin talepleri çekilirken hata oluştu:", error);
        throw error;
    }
};

// İzin durumunu (Onaylandı/Reddedildi) güncellemek için fonksiyon
export const updateLeaveStatus = async (id, status) => {
    try {
        const response = await api.put(`/leaves/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("İzin durumu güncellenirken hata oluştu:", error);
        throw error;
    }
};
export const deleteLeaveRequest = async (id) => {
    await api.delete(`/leaves/${id}`);
};