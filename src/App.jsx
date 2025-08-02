import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { loadData } from './utils/dataLoader';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A5B4FC',
    },
    secondary: {
      main: '#60A5FA',
    },
    background: {
      default: '#0F172A',
      paper: 'rgba(30, 34, 45, 0.98)',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#A5B4FC',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    viewType: 'Specific Date📆',
    selectedDate: null,
    selectedSectors: 'All',
    selectedSeries: 'All',
    searchSymbols: [],
    selectedMonth: '',
    startDate: null,
    endDate: null,
    sortBy: 'None'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loadedData = await loadData();
        setData(loadedData);
        
        // Set default date to max date
        if (loadedData.length > 0) {
          const maxDate = new Date(Math.max(...loadedData.map(d => new Date(d["Today's Date"]))));
          setFilters(prev => ({
            ...prev,
            selectedDate: maxDate,
            startDate: new Date(Math.min(...loadedData.map(d => new Date(d["Today's Date"])))),
            endDate: maxDate
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <div>Error: {error}</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar 
            data={data} 
            filters={filters} 
            setFilters={setFilters} 
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Header />
            <MainContent 
              data={data} 
              filters={filters} 
              setFilters={setFilters}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;