import { musicService } from '../musicService';
import api from '../api';

// Mock do axios
jest.mock('../api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
}));

describe('musicService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMusics', () => {
        test('deve buscar músicas com sucesso', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: [
                        { id: 1, titulo: 'Música 1', visualizacoes: 1000 },
                        { id: 2, titulo: 'Música 2', visualizacoes: 2000 }
                    ]
                }
            };

            api.get.mockResolvedValue(mockResponse);

            const result = await musicService.getMusics();

            expect(api.get).toHaveBeenCalledWith('/musicas');
            expect(result).toEqual(mockResponse.data);
        });

        test('deve lançar erro quando API falha', async () => {
            const errorMessage = 'Network Error';
            api.get.mockRejectedValue(new Error(errorMessage));

            await expect(musicService.getMusics()).rejects.toThrow('Erro ao buscar músicas: Network Error');
        });
    });

    describe('getTop5', () => {
        test('deve buscar top 5 músicas com sucesso', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: [
                        { id: 1, titulo: 'Top 1', visualizacoes: 5000 },
                        { id: 2, titulo: 'Top 2', visualizacoes: 4000 }
                    ]
                }
            };

            api.get.mockResolvedValue(mockResponse);

            const result = await musicService.getTop5();

            expect(api.get).toHaveBeenCalledWith('/musicas/top5');
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('suggestMusic', () => {
        test('deve sugerir música com sucesso', async () => {
            const musicData = {
                youtube_url: 'https://youtube.com/watch?v=123',
                video_id: '123'
            };

            const mockResponse = {
                data: {
                    success: true,
                    message: 'Sugestão enviada com sucesso!'
                }
            };

            api.post.mockResolvedValue(mockResponse);

            const result = await musicService.suggestMusic(musicData);

            expect(api.post).toHaveBeenCalledWith('/sugestoes', musicData);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('login', () => {
        test('deve fazer login com sucesso', async () => {
            const credentials = {
                email: 'admin@test.com',
                password: 'password123'
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        token: 'jwt-token-here',
                        user: { id: 1, email: 'admin@test.com', role: 'admin' }
                    }
                }
            };

            api.post.mockResolvedValue(mockResponse);

            const result = await musicService.login(credentials);

            expect(api.post).toHaveBeenCalledWith('/login', credentials);
            expect(result).toEqual(mockResponse.data);
        });

        test('deve lançar erro quando login falha', async () => {
            const credentials = {
                email: 'wrong@email.com',
                password: 'wrongpassword'
            };

            api.post.mockRejectedValue(new Error('Unauthorized'));

            await expect(musicService.login(credentials)).rejects.toThrow('Erro ao fazer login: Unauthorized');
        });
    });

    describe('getPendingSuggestions', () => {
        test('deve buscar sugestões pendentes com sucesso', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: [
                        { id: 1, titulo: 'Sugestão 1', youtube_url: 'https://youtube.com/watch?v=123' },
                        { id: 2, titulo: 'Sugestão 2', youtube_url: 'https://youtube.com/watch?v=456' }
                    ]
                }
            };

            api.get.mockResolvedValue(mockResponse);

            const result = await musicService.getPendingSuggestions();

            expect(api.get).toHaveBeenCalledWith('/sugestoes/pendentes');
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('approveSuggestion', () => {
        test('deve aprovar sugestão com sucesso', async () => {
            const suggestionId = 1;
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Sugestão aprovada com sucesso!'
                }
            };

            api.patch.mockResolvedValue(mockResponse);

            const result = await musicService.approveSuggestion(suggestionId);

            expect(api.patch).toHaveBeenCalledWith(`/sugestoes/${suggestionId}/aprovar`);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('rejectSuggestion', () => {
        test('deve rejeitar sugestão com sucesso', async () => {
            const suggestionId = 1;
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Sugestão rejeitada com sucesso!'
                }
            };

            api.patch.mockResolvedValue(mockResponse);

            const result = await musicService.rejectSuggestion(suggestionId);

            expect(api.patch).toHaveBeenCalledWith(`/sugestoes/${suggestionId}/reprovar`);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('deleteMusic', () => {
        test('deve deletar música com sucesso', async () => {
            const musicId = 1;
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Música removida com sucesso!'
                }
            };

            api.delete.mockResolvedValue(mockResponse);

            const result = await musicService.deleteMusic(musicId);

            expect(api.delete).toHaveBeenCalledWith(`/musicas/${musicId}`);
            expect(result).toEqual(mockResponse.data);
        });

        test('deve lançar erro quando deletar música falha', async () => {
            const musicId = 999;
            api.delete.mockRejectedValue(new Error('Not Found'));

            await expect(musicService.deleteMusic(musicId)).rejects.toThrow('Erro ao deletar música: Not Found');
        });
    });
});
