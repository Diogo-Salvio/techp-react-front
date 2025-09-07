import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Pagination, Stack, Alert, CircularProgress } from '@mui/material';
import PendingMusicCard from './PendingMusicCard';
import { musicService } from '../musicService';

const PendingMusicList = () => {
    const [pendingMusics, setPendingMusics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 5;


    const loadPendingMusics = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await musicService.getPendingSuggestions();

            if (response.success) {
                setPendingMusics(response.data);
            } else {
                throw new Error(response.message || 'Erro ao carregar sugestões pendentes');
            }
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar sugestões pendentes:', err);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        loadPendingMusics();
    }, [loadPendingMusics]);


    const handleMusicProcessed = useCallback((musicId) => {
        setPendingMusics(prev => prev.filter(music => music.id !== musicId));
    }, []);


    const totalPages = Math.ceil(pendingMusics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMusics = pendingMusics.slice(startIndex, endIndex);


    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Carregando sugestões pendentes...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Typography variant="body1" color="text.secondary">
                    Verifique se o backend está rodando e tente novamente.
                </Typography>
            </Container>
        );
    }

    if (pendingMusics.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    Nenhuma sugestão pendente
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Todas as sugestões foram processadas!
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'warning.main',
                        mb: 2
                    }}
                >
                    Sugestões Pendentes
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    Aguardando aprovação
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Página {currentPage} de {totalPages} • {pendingMusics.length} sugestões
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                {currentMusics.map((music) => (
                    <PendingMusicCard
                        key={music.id}
                        music={music}
                        onMusicProcessed={handleMusicProcessed}
                    />
                ))}
            </Box>

            {totalPages > 1 && (
                <Stack spacing={2} alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontSize: '1.1rem',
                            }
                        }}
                    />
                </Stack>
            )}
        </Container>
    );
};

export default PendingMusicList;
