
import React from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getThumbnailFromUrl } from '../utils/youtubeUtils';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
}));


const MusicCard = ({
    position = 1,
    title = "Nome da Música",
    views = 0,
    thumbnail = "/assets/tiao-carreiro-pardinho.png",
    youtubeUrl = null
}) => {
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

    return (
        <StyledCard elevation={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, width: '100%' }}>



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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            {formatViews(views)} visualizações
                        </Typography>
                    </Box>
                </Box>

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
            </Box>
        </StyledCard>
    );
};

export default MusicCard;