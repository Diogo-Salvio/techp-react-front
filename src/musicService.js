import api from './api';

export const musicService = {
  // Rotas públicas
  getMusics: async () => {
    try {
      const response = await api.get('/musicas');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar músicas: ${error.message}`);
    }
  },

  getTop5: async () => {
    try {
      const response = await api.get('/musicas/top5');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar top 5: ${error.message}`);
    }
  },

  suggestMusic: async (musicData) => {
    try {
      const response = await api.post('/sugestoes', musicData);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao sugerir música: ${error.message}`);
    }
  },


  getPendingSuggestions: async () => {
    try {
      const response = await api.get('/musicas/pendentes');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar sugestões pendentes: ${error.message}`);
    }
  },

  approveMusic: async (musicId, position = null) => {
    try {
      const response = await api.patch(`/musicas/${musicId}/aprovar`, {
        posicao_top5: position
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao aprovar música: ${error.message}`);
    }
  },

  rejectMusic: async (musicId) => {
    try {
      const response = await api.patch(`/musicas/${musicId}/reprovar`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao reprovar música: ${error.message}`);
    }
  }
};