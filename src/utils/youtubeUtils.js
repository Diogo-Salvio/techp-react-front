
/**

@param {string} url 
@returns {string|null}

 */
export const extractVideoId = (url) => {
    if (!url) return null;

    try {
        // Regex para validar URL do YouTube
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);

        return match ? match[1] : null;
    } catch (error) {
        console.error('Erro ao extrair ID do vídeo:', error);
        return null;
    }
};

/**

@param {string} videoId
@returns {string}

 */
export const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null;

    // Tenta primeiro a thumbnail de alta resolução
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**

@param {string} url
@returns {string|null} 

 */
export const getThumbnailFromUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? getYouTubeThumbnail(videoId) : null;
};

/**

@param {string} url
@returns {boolean}

 */
export const isValidYouTubeUrl = (url) => {
    return extractVideoId(url) !== null;
};
