import React, { useState, useCallback } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Button,
    Stack,
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

    const formatViews = (numViews) => {
        if (numViews >= 1000000) {
            return `${(numViews / 1000000).toFixed(1)}M`;
        } else if (numViews >= 1000) {
            return `${(numViews / 1000).toFixed(1)}K`;
        }
        return numViews.toString();
    };

    // Função para extrair o ID do vídeo do YouTube (mesma validação do SuggestionCard)
    const extractVideoId = (url) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);

        if (!match) {
            throw new Error('URL do YouTube inválida');
        }

        return match[1];
    };

    // Determina qual thumbnail usar: YouTube ou fallback
    const getThumbnail = () => {
        if (youtubeUrl) {
            const youtubeThumbnail = getThumbnailFromUrl(youtubeUrl);
            return youtubeThumbnail || thumbnail;
        }
        return thumbnail;
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
            // Validar a URL do YouTube antes de enviar
            const videoId = extractVideoId(newYoutubeUrl);

            const response = await musicService.updateMusic(musicId, { youtube_url: newYoutubeUrl });

            if (response.success) {
                setMessage({ type: 'success', text: 'Link atualizado com sucesso!' });
                setEditDialog(false);
                // Notificar o componente pai sobre a atualização
                if (onMusicUpdated) {
                    onMusicUpdated(musicId, { youtube_url: newYoutubeUrl });
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
        setNewYoutubeUrl(youtubeUrl || '');
        setEditDialog(true);
        setMessage({ type: '', text: '' });
    };

    const handleCloseEdit = () => {
        setEditDialog(false);
        setNewYoutubeUrl(youtubeUrl || '');
    };

    console.log('AdminMusicCard renderizando:', { title, musicId, youtubeUrl });

    return (
        <>
            <StyledCard elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, width: '100%' }}>
                    {/* Posição */}
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
                            {title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                                {formatViews(views)} visualizações
                            </Typography>
                        </Box>


                        {youtubeUrl && (
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
                                Link: {youtubeUrl}
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
                                    href={youtubeUrl}
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
                                        backgroundColor: 'lightblue',
                                        border: '2px solid red',
                                        minWidth: '100px'
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

                    {/* Thumbnail */}
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
                        alt={`Thumbnail da música: ${title}`}
                    />
                </Box>
            </StyledCard>

            {/* Dialog de edição */}
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
                        Música: <strong>{title}</strong>
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

            {/* Dialog de confirmação */}
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
                        Tem certeza que deseja remover a música "{title}"?
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
