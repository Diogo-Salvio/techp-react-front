import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Pagination, Stack, Alert, CircularProgress } from '@mui/material';
import MusicCard from './MusicCard';
import { musicService } from '../musicService';

const MusicList = () => {
    const [allMusics, setAllMusics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const itemsPerPage = 5;

    // Função para carregar todas as músicas
    const loadMusics = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await musicService.getMusics();
            
            if (response.success) {
                setAllMusics(response.data);
            } else {
                throw new Error(response.message || 'Erro ao carregar músicas');
            }
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar músicas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Carregar músicas na montagem do componente
    useEffect(() => {
        loadMusics();
    }, []);

    // Calcular dados da paginação
    const totalPages = Math.ceil(allMusics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMusics = allMusics.slice(startIndex, endIndex);

    // Função para mudar de página
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Carregando músicas...
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

    if (allMusics.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    Nenhuma música encontrada
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Ainda não há músicas aprovadas no sistema.
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
                        color: 'primary.main',
                        mb: 2
                    }}
                >
                    Top Músicas
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    As músicas mais tocadas do momento
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Página {currentPage} de {totalPages} • {allMusics.length} músicas
                </Typography>
            </Box>


            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                {currentMusics.map((music) => (
                    <MusicCard
                        key={music.id}
                        position={music.posicao_top5 || music.id}
                        title={music.titulo}
                        views={music.visualizacoes}
                        thumbnail="/assets/tiao-carreiro-pardinho.png"
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

export default MusicList;