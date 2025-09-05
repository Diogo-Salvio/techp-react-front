
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Container,
} from '@mui/material';

const SuggestionCard = () => {
    const [musicLink, setMusicLink] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (musicLink.trim()) {
            console.log('Link da música:', musicLink);
            setMusicLink('');

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

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
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
                                placeholder="Insira aqui o link da sua música"
                                value={musicLink}
                                onChange={(e) => setMusicLink(e.target.value)}
                                sx={{
                                    minWidth: { xs: '100%', sm: 300 },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    minWidth: 140,
                                    height: 56,
                                }}
                            >
                                Enviar música
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default SuggestionCard