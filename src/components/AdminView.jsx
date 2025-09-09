import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Container,
    Paper,
    Button,
    Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AdminMusicList from './AdminMusicList';
import PendingMusicList from './PendingMusicList';
import LoginForm from './LoginForm';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AdminView = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const { user, loading, logout, isAdmin, isAuthenticated } = useAuth();


    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleLoginSuccess = (userData) => {

        console.log('Login realizado com sucesso:', userData);
    };

    const handleLogout = async () => {
        await logout();
        setCurrentTab(0);
    };


    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Verificando autenticação...</Typography>
            </Container>
        );
    }


    if (!isAuthenticated) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 2
                        }}
                    >
                        Painel Administrativo
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                    >
                        Faça login para acessar as funcionalidades administrativas
                    </Typography>
                </Box>

                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </Container>
        );
    }


    if (!isAdmin()) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Você não tem permissão para acessar o painel administrativo.
                </Alert>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Debug:</strong> Usuário: {JSON.stringify(user, null, 2)}
                </Alert>
                <Button variant="contained" onClick={handleLogout}>
                    Fazer Logout
                </Button>
            </Container>
        );
    }


    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 2
                    }}
                >
                    Painel Administrativo
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Bem-vindo, {user?.name || user?.email}!
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                    size="small"
                >
                    Logout
                </Button>
            </Box>

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        aria-label="admin tabs"
                        centered
                    >
                        <Tab
                            label="Músicas Aprovadas"
                            id="admin-tab-0"
                            aria-controls="admin-tabpanel-0"
                        />
                        <Tab
                            label="Sugestões Pendentes"
                            id="admin-tab-1"
                            aria-controls="admin-tabpanel-1"
                        />
                    </Tabs>
                </Box>

                <TabPanel value={currentTab} index={0}>
                    <AdminMusicList />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <PendingMusicList />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default AdminView;
