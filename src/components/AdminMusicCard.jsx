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
    DialogActions
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
    onMusicDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [confirmDialog, setConfirmDialog] = useState(false);

    const formatViews = (numViews) => {
        if (numViews >= 1000000) {
            return `${(numViews / 1000000).toFixed(1)}M`;
        } else if (numViews >= 1000) {
            return `${(numViews / 1000).toFixed(1)}K`;
        }
        return numViews.toString();
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

    const handleConfirmDelete = () => {
        setConfirmDialog(true);
    };

    const handleCancelDelete = () => {
        setConfirmDialog(false);
    };

    return (
        <>
            <StyledCard elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, width: '100%' }}>
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
                        fontSize: '1.1rem'
                    }}>
                        {position}
                    </Box>

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
                        alt={`Thumbnail da música: ${title}`}
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
                                variant="outlined"
                                size="small"
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver no YouTube
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
                        </Stack>
                    </Box>
                </Box>
            </StyledCard>

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
