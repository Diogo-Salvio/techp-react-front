import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import SuggestionCard from './components/SuggestionCard';
import MusicList from './components/MusicList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <SuggestionCard />
        <MusicList />
      </div>
    </ThemeProvider>
  );
}

export default App;
