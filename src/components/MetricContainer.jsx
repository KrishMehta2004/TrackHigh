import React from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MetricContainer = ({ label, value, unit = "", color = "white", trend = null }) => {
  const trendColors = {
    "up": "#22C55E",
    "down": "#EF4444",
    null: "white"
  };

  const TrendIcon = trend === "up" ? TrendingUpIcon : trend === "down" ? TrendingDownIcon : null;

  return (
    <Box
      className="metric-container metric-container-hover"
      sx={{
        backgroundColor: 'rgba(30, 34, 45, 0.98)',
        padding: '15px',
        borderRadius: '8px',
        margin: '8px 0',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 2px 12px rgba(30,34,45,0.10)',
        transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(51, 65, 85, 0.98)',
          boxShadow: '0 6px 24px rgba(30,34,45,0.18)',
          transform: 'scale(1.03)'
        }
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#A5B4FC',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          display: 'block'
        }}
      >
        {label}
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: color,
            fontSize: '20px',
            fontWeight: 600,
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          dangerouslySetInnerHTML={{ __html: `${value}${unit ? ' ' + unit : ''}` }}
        />
        {TrendIcon && (
          <TrendIcon 
            sx={{ 
              color: trendColors[trend], 
              fontSize: '20px' 
            }} 
          />
        )}
      </Box>
    </Box>
  );
};

export default MetricContainer;