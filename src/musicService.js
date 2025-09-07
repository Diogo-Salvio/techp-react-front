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


  // Rotas protegidas (requerem autenticação)
  getPendingSuggestions: async () => {
    try {
      const response = await api.get('/sugestoes/pendentes');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar sugestões pendentes: ${error.message}`);
    }
  },

  approveSuggestion: async (suggestionId) => {
    try {
      const response = await api.patch(`/sugestoes/${suggestionId}/aprovar`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao aprovar sugestão: ${error.message}`);
    }
  },

  rejectSuggestion: async (suggestionId) => {
    try {
      const response = await api.patch(`/sugestoes/${suggestionId}/reprovar`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao reprovar sugestão: ${error.message}`);
    }
  }
};