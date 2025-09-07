import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Container,
    Paper
} from '@mui/material';
import MusicList from './MusicList';
import PendingMusicList from './PendingMusicList';

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

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

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
                    Gerenciar músicas aprovadas e sugestões pendentes
                </Typography>
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
                    <MusicList />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <PendingMusicList />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default AdminView;
