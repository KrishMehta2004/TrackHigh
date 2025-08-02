import React from 'react';
import Plot from 'react-plotly.js';
import { Box } from '@mui/material';

const SectorChart = ({ data }) => {
  // Count sectors, filtering out null/undefined values
  const sectorCounts = {};
  const sectorOrder = [];
  data.forEach(row => {
    const sector = row['Sector'];
    if (sector && sector !== 'N/A' && sector !== 'nan') {
      if (!sectorCounts[sector]) sectorOrder.push(sector);
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    }
  });

  // Use sectorOrder to preserve order of appearance
  const sectors = sectorOrder;
  const counts = sectors.map(sector => sectorCounts[sector]);

  // Defensive: ensure sectors and counts are always arrays of same length
  if (!Array.isArray(sectors) || !Array.isArray(counts) || sectors.length !== counts.length || sectors.length === 0) {
    return (
      <Box sx={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px'
      }}>
        No sector data available
      </Box>
    );
  }

  const maxValue = Math.max(...counts);

  const plotData = [{
    x: sectors,
    y: counts,
    type: 'bar',
    marker: {
      color: 'rgb(165, 180, 252)',
      line: {
        color: 'rgb(129, 140, 248)',
        width: 1.5
      },
      opacity: 0.8
    },
    text: counts,
    textposition: 'outside',
    textfont: {
      color: '#A5B4FC',
      size: 12
    }
  }];

  const layout = {
    title: {
      text: 'Sector Distribution',
      y: 0.95,
      x: 0.5,
      xanchor: 'center',
      yanchor: 'top',
      font: {
        size: 24,
        color: '#A5B4FC'
      }
    },
    xaxis: {
      tickangle: -45,
      title: 'Sector',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#9CA3AF'
    },
    yaxis: {
      title: 'Number of Companies',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      range: [0, maxValue * 1.2],
      color: '#9CA3AF'
    },
    template: 'plotly_dark',
    showlegend: false,
    height: 400,
    margin: {
      t: 100,
      b: 80,
      l: 60,
      r: 40
    },
    paper_bgcolor: 'rgba(17, 24, 39, 0.7)',
    plot_bgcolor: 'rgba(17, 24, 39, 0.7)',
    font: {
      color: '#9CA3AF'
    }
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '400px' }}
        useResizeHandler={true}
      />
    </Box>
  );
};

export default SectorChart;