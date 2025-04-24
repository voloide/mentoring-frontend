import api from '../apiService/apiService';

export default {
  async getSessionReport() {
    try {
      const response = await api().get('/sessions/report');
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de sessões:', error.message);
      throw error;
    }
  },

  // Aqui você pode incluir outros métodos como:
  // async getAll(), async search(), async post(), etc.
};
