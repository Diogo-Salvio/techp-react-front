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
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });


    const extractVideoId = (url) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);

        if (!match) {
            throw new Error('URL do YouTube inválida');
        }

        return match[1];
    };

    const handleSubmit = async () => {
        if (!musicLink.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira um link válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const videoId = extractVideoId(musicLink);

            const response = await musicService.suggestMusic({
                youtube_url: musicLink,
                video_id: videoId
            });

            if (response.success) {
                setMessage({ type: 'success', text: response.message });
                setMusicLink('');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
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
                                disabled={loading}
                                sx={{
                                    minWidth: { xs: '100%', sm: 300 },
                                }}
                            />

                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loading || !musicLink.trim()}
                                sx={{
                                    minWidth: 140,
                                    height: 56,
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Enviar Sugestão'}
                            </Button>
                        </Box>

                        
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