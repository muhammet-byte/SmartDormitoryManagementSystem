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