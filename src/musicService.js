import api from './api';

export const musicService = {
  // Buscar todas as músicas aprovadas
  getMusics: async () => {
    try {
      const response = await api.get('/musicas');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar músicas: ${error.message}`);
    }
  },

  // Buscar top 5 músicas
  getTop5: async () => {
    try {
      const response = await api.get('/musicas/top5');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar top 5: ${error.message}`);
    }
  },

  // Sugerir nova música
  suggestMusic: async (musicData) => {
    try {
      const response = await api.post('/musicas/sugerir', musicData);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao sugerir música: ${error.message}`);
    }
  },

  // Buscar sugestões pendentes (apenas para usuários autenticados)
  getPendingSuggestions: async () => {
    try {
      const response = await api.get('/musicas/pendentes');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar sugestões pendentes: ${error.message}`);
    }
  }
};