import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Link
} from '@mui/material';
import SectorChart from '../SectorChart';

const DateRangeView = ({ data, startDate, endDate }) => {
  const [sortOption, setSortOption] = useState('Returns (High to Low)');

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="warning.main">
          No data found for the selected period
        </Typography>
      </Box>
    );
  }

  const dateDisplay = startDate && endDate
    ? `${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} to ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : 'Selected Period';

  // Calculate metrics
  const totalStocks = new Set(data.map(row => row['Symbol'])).size;
  const totalSectors = new Set(data.map(row => row['Sector']).filter(s => s && s !== 'N/A')).size;
  const avgChange = data.reduce((sum, row) => sum + (row['Returns'] || row['%chng'] || 0), 0) / data.length;

  // Calculate stock occurrences and max returns
  const stockOccurrences = {};
  const stockInfo = {};
  const maxReturns = {};

  data.forEach(row => {
    const symbol = row['Symbol'];
    const date = row["Today's Date"];
    
    if (!stockOccurrences[symbol]) {
      stockOccurrences[symbol] = new Set();
      stockInfo[symbol] = {
        seriesType: row['Series Type'] || 'N/A',
        sector: row['Sector'] || 'N/A'
      };
      maxReturns[symbol] = row['Returns'] || row['%chng'] || 0;
    }
    
    stockOccurrences[symbol].add(date);
    const currentReturn = row['Returns'] || row['%chng'] || 0;
    if (currentReturn > maxReturns[symbol]) {
      maxReturns[symbol] = currentReturn;
    }
  });

  // Convert to array format
  let stockTable = Object.keys(stockOccurrences).map(symbol => ({
    symbol,
    occurrences: stockOccurrences[symbol].size,
    maxReturns: maxReturns[symbol],
    seriesType: stockInfo[symbol].seriesType,
    sector: stockInfo[symbol].sector
  }));

  // Sort based on selected option
  if (sortOption === 'Returns (High to Low)') {
    stockTable.sort((a, b) => b.maxReturns - a.maxReturns);
  } else {
    stockTable.sort((a, b) => b.occurrences - a.occurrences);
  }

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
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

      {/* Most Frequent Stocks */}
      <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
        📈 Most Frequent Stocks
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Stocks that appeared most frequently during the selected period
      </Typography>

      {/* Sort Options */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
            Sort table by:
          </FormLabel>
          <RadioGroup
            row
            value={sortOption}
            onChange={handleSortChange}
          >
            <FormControlLabel value="Returns (High to Low)" control={<Radio />} label="Returns (High to Low)" />
            <FormControlLabel value="Occurrences (High to Low)" control={<Radio />} label="Occurrences (High to Low)" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Stock Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(165, 180, 252, 0.1)' }}>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Symbol
              </TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Occurrences
              </TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Returns
              </TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Series Type
              </TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Sector
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockTable.map((row, index) => {
              const returnsDisplay = row.maxReturns !== null && row.maxReturns !== undefined
                ? `${row.maxReturns > 0 ? '💹' : '🔻'}${row.maxReturns >= 0 ? '+' : ''}${row.maxReturns.toFixed(2)}%`
                : 'N/A';

              return (
                <TableRow key={index}>
                  <TableCell sx={{ color: 'text.primary' }}>
                    <Link
                      href={`https://www.screener.in/company/${row.symbol}`}
                      target="_blank"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {row.symbol}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {row.occurrences}
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {returnsDisplay}
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {row.seriesType}
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {row.sector}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DateRangeView;