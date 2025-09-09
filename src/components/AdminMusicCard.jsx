import React, { useState, useCallback } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Button,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getThumbnailFromUrl } from '../utils/youtubeUtils';
import { musicService } from '../musicService';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    border: `2px solid ${theme.palette.success.light}`,
}));

const AdminMusicCard = ({
    position = 1,
    title = "Nome da Música",
    views = 0,
    thumbnail = "/assets/tiao-carreiro-pardinho.png",
    youtubeUrl = null,
    musicId,
    onMusicDeleted,
    onMusicUpdated
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [newYoutubeUrl, setNewYoutubeUrl] = useState(youtubeUrl || '');

    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentThumbnail, setCurrentThumbnail] = useState(thumbnail);
    const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState(youtubeUrl);
    const [currentViews, setCurrentViews] = useState(views);

    const formatViews = (numViews) => {
        if (numViews >= 1000000) {
            return `${(numViews / 1000000).toFixed(1)}M`;
        } else if (numViews >= 1000) {
            return `${(numViews / 1000).toFixed(1)}K`;
        }
        return numViews.toString();
    };


    const extractVideoId = (url) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);

        if (!match) {
            throw new Error('URL do YouTube inválida');
        }

        return match[1];
    };


    const getThumbnail = () => {
        if (currentYoutubeUrl) {
            const youtubeThumbnail = getThumbnailFromUrl(currentYoutubeUrl);
            return youtubeThumbnail || currentThumbnail;
        }
        return currentThumbnail;
    };

    const fetchYouTubeVideoData = async (videoId) => {
        try {
            // Simulação de busca de dados (substitua por chamada real à API)
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);

            if (response.ok) {
                const data = await response.json();
                return {
                    title: data.title,
                    thumbnail: data.thumbnail_url,
                    views: Math.floor(Math.random() * 10000000) + 100000 // Simulação de visualizações
                };
            }

            // Fallback se a API não funcionar
            return {
                title: `Vídeo ${videoId}`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                views: Math.floor(Math.random() * 10000000) + 100000 // Simulação de visualizações
            };
        } catch (error) {
            console.error('Erro ao buscar dados do YouTube:', error);
            // Fallback em caso de erro
            return {
                title: `Vídeo ${videoId}`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                views: Math.floor(Math.random() * 10000000) + 100000 // Simulação de visualizações
            };
        }
    };

    const handleDelete = useCallback(async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await musicService.deleteMusic(musicId);

            if (response.success) {
                setMessage({ type: 'success', text: 'Música removida com sucesso!' });
                setTimeout(() => {
                    onMusicDeleted(musicId);
                }, 1500);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
            setConfirmDialog(false);
        }
    }, [musicId, onMusicDeleted]);

    const handleUpdateUrl = useCallback(async () => {
        if (!newYoutubeUrl.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira um link válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const videoId = extractVideoId(newYoutubeUrl);


            const videoData = await fetchYouTubeVideoData(videoId);


            const updateData = {
                youtube_url: newYoutubeUrl,
                titulo: videoData.title,
                thumbnail: videoData.thumbnail,
                visualizacoes: videoData.views
            };

            const response = await musicService.updateMusic(musicId, updateData);

            if (response.success) {
                setMessage({ type: 'success', text: 'Link e dados atualizados com sucesso!' });
                setEditDialog(false);


                setCurrentTitle(videoData.title);
                setCurrentThumbnail(videoData.thumbnail);
                setCurrentYoutubeUrl(newYoutubeUrl);
                setCurrentViews(videoData.views);


                if (onMusicUpdated) {
                    onMusicUpdated(musicId, updateData);
                }
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }, [musicId, newYoutubeUrl, onMusicUpdated]);

    const handleConfirmDelete = () => {
        setConfirmDialog(true);
    };

    const handleCancelDelete = () => {
        setConfirmDialog(false);
    };

    const handleOpenEdit = () => {
        setNewYoutubeUrl(currentYoutubeUrl || '');
        setEditDialog(true);
        setMessage({ type: '', text: '' });
    };

    const handleCloseEdit = () => {
        setEditDialog(false);
        setNewYoutubeUrl(currentYoutubeUrl || '');
    };


    return (
        <>
            <StyledCard elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, width: '100%' }}>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        mr: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        flexShrink: 0
                    }}>
                        {position}
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
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
                            {currentTitle}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                                {formatViews(currentViews)} visualizações
                            </Typography>
                        </Box>

                        {currentYoutubeUrl && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block',
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Link: {currentYoutubeUrl}
                            </Typography>
                        )}

                        {message.text && (
                            <Alert
                                severity={message.type === 'error' ? 'error' : 'success'}
                                sx={{ mb: 1, py: 0 }}
                            >
                                {message.text}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    href={currentYoutubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver no YouTube
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={handleOpenEdit}
                                    disabled={loading}
                                    sx={{
                                        minWidth: '100px',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    Editar Link
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={handleConfirmDelete}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={16} /> : null}
                                >
                                    Remover
                                </Button>
                            </Box>
                        </Box>
                    </Box>


                    <CardMedia
                        component="img"
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            objectFit: 'cover',
                            flexShrink: 0
                        }}
                        image={getThumbnail()}
                        alt={`Thumbnail da música: ${currentTitle}`}
                    />
                </Box>
            </StyledCard>


            <Dialog
                open={editDialog}
                onClose={handleCloseEdit}
                aria-labelledby="edit-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="edit-dialog-title">
                    Editar Link do YouTube
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Música: <strong>{currentTitle}</strong>
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Link do YouTube"
                        placeholder="https://www.youtube.com/watch?v=..."
                        fullWidth
                        variant="outlined"
                        value={newYoutubeUrl}
                        onChange={(e) => setNewYoutubeUrl(e.target.value)}
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpdateUrl}
                        variant="contained"
                        disabled={loading || !newYoutubeUrl.trim()}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDialog}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirmar Remoção
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja remover a música "{currentTitle}"?
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Remover'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminMusicCard;
