import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material';
import { musicService } from '../musicService';

const SuggestionCard = () => {
    const [musicLink, setMusicLink] = useState('');
    const [extractedData, setExtractedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Função para extrair dados do YouTube
    const extractYouTubeData = async (url) => {
        try {
            // Regex para validar URL do YouTube
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(youtubeRegex);
            
            if (!match) {
                throw new Error('URL do YouTube inválida');
            }

            const videoId = match[1];
            
            // Simular extração de dados (em produção, você usaria a YouTube API)
            // Por enquanto, vamos extrair o título da URL ou usar um placeholder
            const title = extractTitleFromUrl(url) || 'Título não encontrado';
            
            return {
                videoId,
                title,
                url: url,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            };
        } catch (error) {
            throw new Error('Erro ao extrair dados do YouTube: ' + error.message);
        }
    };

    // Função auxiliar para extrair título da URL (básica)
    const extractTitleFromUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            return params.get('v') ? `Música ${params.get('v')}` : null;
        } catch {
            return null;
        }
    };

    const handleProcessLink = async () => {
        if (!musicLink.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira um link válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = await extractYouTubeData(musicLink);
            setExtractedData(data);
            setMessage({ type: 'success', text: 'Dados extraídos com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            setExtractedData(null);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async () => {
        if (!extractedData) {
            setMessage({ type: 'error', text: 'Por favor, processe o link primeiro' });
            return;
        }

        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await musicService.suggestMusic({
                youtube_url: extractedData.url,
                video_id: extractedData.videoId
            });

            if (response.success) {
                setMessage({ type: 'success', text: response.message });
                setMusicLink('');
                setExtractedData(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSubmitting(false);
        }
    };


    const handleClear = () => {
        setMusicLink('');
        setExtractedData(null);
        setMessage({ type: '', text: '' });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        mt: 2,
                    }}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            p: 3,
                        }}
                    >
                        <Typography variant="h5" component="h3" textAlign="center">
                            Sugerir nova música
                        </Typography>

                        {/* Campo de entrada */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Insira aqui o link do YouTube da música"
                                value={musicLink}
                                onChange={(e) => setMusicLink(e.target.value)}
                                disabled={loading || submitting}
                                sx={{
                                    minWidth: { xs: '100%', sm: 300 },
                                }}
                            />

                            <Button
                                onClick={handleProcessLink}
                                variant="outlined"
                                color="primary"
                                disabled={loading || submitting || !musicLink.trim()}
                                sx={{
                                    minWidth: 140,
                                    height: 56,
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Processar'}
                            </Button>
                        </Box>

                        {/* Mensagens */}
                        {message.text && (
                            <Alert 
                                severity={message.type === 'error' ? 'error' : 'success'}
                                sx={{ width: '100%' }}
                            >
                                {message.text}
                            </Alert>
                        )}

                        {extractedData && (
                            <Box sx={{ width: '100%' }}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Preview da música:
                                </Typography>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    alignItems: 'center',
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    mb: 2
                                }}>
                                    <Box
                                        component="img"
                                        src={extractedData.thumbnail}
                                        alt="Thumbnail"
                                        sx={{
                                            width: 80,
                                            height: 60,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {extractedData.title}
                                        </Typography>
                                        <Chip 
                                            label={`ID: ${extractedData.videoId}`} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        color="primary"
                                        disabled={submitting}
                                        sx={{ minWidth: 120 }}
                                    >
                                        {submitting ? <CircularProgress size={24} /> : 'Enviar Sugestão'}
                                    </Button>
                                    <Button
                                        onClick={handleClear}
                                        variant="outlined"
                                        disabled={submitting}
                                    >
                                        Limpar
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default SuggestionCard;