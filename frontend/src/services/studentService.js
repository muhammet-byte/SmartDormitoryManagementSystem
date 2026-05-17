import api from './api';

export const getAllStudents = async () => {
    try {
        const response = await api.get('/students');
        return response.data;
    } catch (error) {
        console.error("Öğrenci verileri çekilirken hata oluştu:", error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        await api.delete(`/students/${id}`);
    } catch (error) {
        console.error("Öğrenci silinirken hata oluştu:", error);
        throw error;
    }
};

export const createStudent = async (studentData) => {
    try {
        const response = await api.post('/students', studentData);
        return response.data;
    } catch (error) {
        console.error("Öğrenci eklenirken hata oluştu:", error);
        throw error;
    }
};
export const addStudent = async (studentData) => {
    try {
        const response = await api.post('/students', studentData);
        return response.data;
    } catch (error) {
        console.error("Öğrenci eklenemedi:", error);
        throw error;
    }
};