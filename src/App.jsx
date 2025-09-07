import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Tabs, Tab, Container } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import SuggestionCard from './components/SuggestionCard';
import MusicList from './components/MusicList';
import AdminView from './components/AdminView';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
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

function App() {
  const [currentTab, setCurrentTab] = useState(1);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />

        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="main navigation tabs"
              centered
            >
              <Tab
                label="Sugerir Música"
                id="main-tab-0"
                aria-controls="main-tabpanel-0"
              />
              <Tab
                label="Músicas Aprovadas"
                id="main-tab-1"
                aria-controls="main-tabpanel-1"
              />
              <Tab
                label="Painel Admin"
                id="main-tab-2"
                aria-controls="main-tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <SuggestionCard />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <MusicList />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <AdminView />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
