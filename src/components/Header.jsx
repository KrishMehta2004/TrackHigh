import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Header = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h2" 
        className="dashboard-title"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          fontSize: { xs: '2rem', md: '3rem' }
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 'inherit' }} />
        Stock Data Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
        Track and view NSE 52-week high stocks.
      </Typography>

      <Alert 
        severity="info" 
        sx={{ 
          bgcolor: 'rgba(96, 165, 250, 0.1)', 
          border: '1px solid rgba(96, 165, 250, 0.3)',
          '& .MuiAlert-message': {
            color: '#E2E8F0'
          }
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Comprehensive Tracking Tool:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          <li>Track specific dates or date ranges</li>
          <li>Track Returns of the stocks</li>
          <li>Search and monitor individual stocks</li>
        </Box>
      </Alert>
    </Box>
  );
};

export default Header;