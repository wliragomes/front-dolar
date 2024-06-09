import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dolar-api-13db308d017b.herokuapp.com/api',
});

export const getTMRData = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(`/TMR/get-pagination`, {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        throw error;
    }
};

export const postTMRData = async (data) => {
    try {
        let response;
        if (data.id) {
            response = await api.put(`/TMR`, data);
        } else {
            response = await api.post(`/TMR`, data);
        }
        
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
        throw error;
    }
};

export const deleteTMRData = async (id) => {
    try {
        await api.delete(`/TMR/${id}`);
    } catch (error) {
        console.error('Erro ao deletar dados da API:', error);
        throw error;
    }
};
