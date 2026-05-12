import api from './api';

export const findBestRoomMatch = async (preferences) => {
    try {
        const response = await api.post('/match/find', preferences);
        return response.data;
    } catch (error) {
        console.error("Eşleştirme sırasında hata oluştu:", error);
        throw error;
    }
};
export const sendRoomChangeRequest = async (userId, roomId) => {
    try {
        const response = await api.post('/room-change/request', { userId, roomId });
        return response.data;
    } catch (error) {
        console.error("Talep gönderilemedi:", error);
        throw error;
    }
};