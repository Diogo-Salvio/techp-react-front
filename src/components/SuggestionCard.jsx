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
    CircularProgress
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

            // Enviar diretamente se o link for válido
            await handleSubmit(data);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            setExtractedData(null);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (data = null) => {
        const musicData = data || extractedData;

        if (!musicData) {
            setMessage({ type: 'error', text: 'Por favor, processe o link primeiro' });
            return;
        }

        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await musicService.suggestMusic({
                youtube_url: musicData.url,
                video_id: musicData.videoId
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
                                variant="contained"
                                color="primary"
                                disabled={loading || submitting || !musicLink.trim()}
                                sx={{
                                    minWidth: 140,
                                    height: 56,
                                }}
                            >
                                {loading || submitting ? <CircularProgress size={24} /> : 'Enviar Sugestão'}
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

                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default SuggestionCard;