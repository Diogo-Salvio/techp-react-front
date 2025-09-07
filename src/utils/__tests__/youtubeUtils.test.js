import { getThumbnailFromUrl } from '../youtubeUtils';

describe('youtubeUtils', () => {
    describe('getThumbnailFromUrl', () => {
        test('deve extrair thumbnail de URL do YouTube válida', () => {
            const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const expected = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';

            const result = getThumbnailFromUrl(url);

            expect(result).toBe(expected);
        });

        test('deve extrair thumbnail de URL youtu.be', () => {
            const url = 'https://youtu.be/dQw4w9WgXcQ';
            const expected = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';

            const result = getThumbnailFromUrl(url);

            expect(result).toBe(expected);
        });

        test('deve retornar null para URL inválida', () => {
            const url = 'https://www.google.com';

            const result = getThumbnailFromUrl(url);

            expect(result).toBeNull();
        });

        test('deve retornar null para string vazia', () => {
            const result = getThumbnailFromUrl('');

            expect(result).toBeNull();
        });

        test('deve retornar null para null', () => {
            const result = getThumbnailFromUrl(null);

            expect(result).toBeNull();
        });
    });
});
