import React, { useState, useCallback } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Button,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { musicService } from '../musicService';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    border: `2px solid ${theme.palette.warning.light}`,
}));

const PendingMusicCard = ({
    music,
    onMusicProcessed
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });


    const extractVideoId = (url) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        return match ? match[1] : null;
    };


    const getThumbnail = () => {
        if (music.youtube_url) {
            const videoId = extractVideoId(music.youtube_url);
            if (videoId) {
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }
        return "/assets/tiao-carreiro-pardinho.png";
    };


    const handleApprove = useCallback(async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await musicService.approveSuggestion(music.id);

            if (response.success) {
                setMessage({ type: 'success', text: 'Sugestão aprovada com sucesso!' });
                setTimeout(() => {
                    onMusicProcessed(music.id);
                }, 1500);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }, [music.id, onMusicProcessed]);


    const handleReject = useCallback(async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await musicService.rejectSuggestion(music.id);

            if (response.success) {
                setMessage({ type: 'success', text: 'Sugestão rejeitada com sucesso!' });
                setTimeout(() => {
                    onMusicProcessed(music.id);
                }, 1500);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }, [music.id, onMusicProcessed]);

    return (
        <StyledCard elevation={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, width: '100%' }}>
                {/* Thumbnail */}
                <CardMedia
                    component="img"
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        mr: 2,
                        objectFit: 'cover'
                    }}
                    image={getThumbnail()}
                    alt={`Thumbnail da música: ${music.titulo || 'Música pendente'}`}
                />

                {/* Informações da música */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontWeight: 'bold',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {music.titulo || 'Título não disponível'}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        Sugerida em: {new Date(music.created_at).toLocaleDateString('pt-BR')}
                    </Typography>

                    {/* Mensagens de feedback */}
                    {message.text && (
                        <Alert
                            severity={message.type === 'error' ? 'error' : 'success'}
                            sx={{ mb: 1, py: 0 }}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {/* Botões de ação */}
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={handleApprove}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                        >
                            Aprovar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleReject}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                        >
                            Rejeitar
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            href={music.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver no YouTube
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </StyledCard>
    );
};

export default PendingMusicCard;
