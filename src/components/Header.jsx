import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Container
} from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '40vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        backgroundImage: 'url(/assets/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          zIndex: 1,
        }}
      >
        <Avatar
          src="/assets/tiao-carreiro-pardinho.png"
          alt="Tião Carreiro"
          sx={{
            width: 150,
            height: 150,
            border: '2px solid white',
          }}
        />

        <Typography
          variant="h1"
          sx={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          As Mais Tocadas de Tião Carreiro e Pardinho
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: 'white',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          Tião Carreiro e Pardinho
        </Typography>
      </Container>
    </Box>
  );
};


export default Header