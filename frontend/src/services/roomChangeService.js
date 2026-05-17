import api from './api';

// Yöneticinin tüm talepleri çekmesi için
export const getAllRoomChangeRequests = async () => {
    try {
        const response = await api.get('/room-change/all');
        return response.data;
    } catch (error) {
        console.error("Oda değişiklik talepleri çekilemedi:", error);
        throw error;
    }
};

// Yöneticinin talebi onaylaması için
export const approveRoomChangeRequest = async (id) => {
    try {
        const response = await api.put(`/room-change/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Talep onaylanırken hata oluştu:", error);
        throw error;
    }
};

// Yöneticinin talebi reddetmesi için (BEYAZ EKRANI ÇÖZEN YENİ FONKSİYON)
export const rejectRoomChangeRequest = async (id) => {
    try {
        const response = await api.put(`/room-change/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error("Talep reddedilirken hata oluştu:", error);
        throw error;
    }
};