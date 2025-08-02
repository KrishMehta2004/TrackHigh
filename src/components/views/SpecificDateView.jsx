import React from 'react';
import { Divider } from '@mui/material'; // Add this import
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material';
import StockCard from '../StockCard';
import SectorChart from '../SectorChart';
import { applySorting, getLatestStockData } from '../../utils/dataProcessing';

const SpecificDateView = ({ data, filters, setFilters, selectedDate }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="warning.main">
          No data found for the selected filters.
        </Typography>
      </Box>
    );
  }

  const dateDisplay = selectedDate 
    ? selectedDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Selected Date';

  // Calculate metrics
  const totalStocks = new Set(data.map(row => row['Symbol'])).size;
  const totalSectors = new Set(data.map(row => row['Sector']).filter(s => s && s !== 'N/A')).size;
  const avgChange = data.reduce((sum, row) => sum + (row['Returns'] || row['%chng'] || 0), 0) / data.length;

  // Apply sorting
  const sortedData = applySorting(data, filters.sortBy);
  const latestStockData = getLatestStockData(sortedData);

  const handleSortChange = (event) => {
    setFilters(prev => ({
      ...prev,
      sortBy: event.target.value
    }));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        Analysis for {dateDisplay}
      </Typography>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {totalStocks}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Stocks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {totalSectors}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Sectors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: avgChange >= 0 ? '#22C55E' : '#EF4444', 
                  fontWeight: 'bold' 
                }}
              >
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Average Change
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sector Chart */}
      <SectorChart data={data} />

      {/* Sort Options */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
            Sort stocks by:
          </FormLabel>
          <RadioGroup
            row
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <FormControlLabel value="None" control={<Radio />} label="None" />
            <FormControlLabel value="Returns (High to Low)" control={<Radio />} label="Returns (High to Low)" />
            <FormControlLabel value="Mcap (low to high)" control={<Radio />} label="Mcap (Low to High)" />
            <FormControlLabel value="P/E (low to high)" control={<Radio />} label="P/E (Low to High)" />
            <FormControlLabel value="Days Since New High (High to low)" control={<Radio />} label="Days Since New High (High to Low)" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Stock Details */}
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Stock Details
      </Typography>

      {latestStockData.map((row, index) => (
        <StockCard key={`${row['Symbol']}-${index}`} row={row} />
      ))}
    </Box>
  );
};

export default SpecificDateView;