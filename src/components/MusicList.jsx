import React, { useState } from 'react';
import { Box, Typography, Container, Stack, Pagination } from '@mui/material';
import MusicCard from './MusicCard';

const MusicList = () => {
    const [musics] = useState([
        {
            id: 1,
            position: 1,
            title: "Boate Azul",
            views: 2500000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        },
        {
            id: 2,
            position: 2,
            title: "Pé de Cana",
            views: 1800000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        },
        {
            id: 3,
            position: 3,
            title: "Chora Viola",
            views: 1500000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        },
        {
            id: 4,
            position: 4,
            title: "Pagode Russo",
            views: 1200000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        },
        {
            id: 5,
            position: 5,
            title: "Fio de Cabelo",
            views: 950000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        },
        {
            id: 6,
            position: 6,
            title: "Fio de Cabelo",
            views: 950000,
            thumbnail: "/assets/tiao-carreiro-pardinho.png"
        }
    ]);

    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    
    const totalPages = Math.ceil(musics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMusics = musics.slice(startIndex, endIndex);

    // Função para mudar de página
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

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
                    Top 5 Músicas
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    As músicas mais tocadas do momento
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {currentMusics.map((music) => (
                    <MusicCard
                        key={music.id}
                        position={music.position}
                        title={music.title}
                        views={music.views}
                        thumbnail={music.thumbnail}
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