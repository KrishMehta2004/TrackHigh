import React from 'react';
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
  Link
} from '@mui/material';
import { getStockHighs } from '../../utils/dataProcessing';
import { formatNumber } from '../../utils/utilities';

const SearchStockView = ({ data, searchSymbols }) => {
  if (!searchSymbols || searchSymbols.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Please select one or more stock symbols to view their analysis
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {searchSymbols.map(symbol => {
        const { highDates, stockData } = getStockHighs(data, symbol);
        
        if (!stockData || stockData.length === 0) {
          return (
            <Box key={symbol} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ color: 'warning.main' }}>
                No data found for symbol {symbol}
              </Typography>
            </Box>
          );
        }

        const highestPrice = Math.max(...stockData.map(row => row['LTP'] || 0));
        const highPointsCount = highDates.length;

        return (
          <Box key={symbol} sx={{ mb: 6 }}>
            {/* Title */}
            <Box
              sx={{
                backgroundColor: 'rgba(17, 24, 39, 0.7)',
                padding: '20px',
                borderRadius: '10px',
                mb: 3
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  margin: 0,
                  color: '#00FFFF',
                  fontWeight: 'bold'
                }}
              >
                {symbol} Analysis
              </Typography>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {formatNumber(highestPrice)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      52-Week High
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {highPointsCount} dates
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      High Points Found
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* High Points Timeline */}
            {highDates.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                  📊 High Points Timeline
                </Typography>
                
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
                          Date
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                          Stock Price
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                          Daily Change
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {highDates
                        .sort((a, b) => new Date(b["Today's Date"]) - new Date(a["Today's Date"]))
                        .map((row, index) => {
                          const date = new Date(row["Today's Date"]).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          });
                          const price = formatNumber(row['LTP']);
                          const change = row['Returns'] || row['%chng'] || 0;
                          const changeDisplay = change !== null && change !== undefined
                            ? `${change > 0 ? '💹' : '🔻'}${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
                            : 'N/A';

                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ color: 'text.primary' }}>
                                {date}
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>
                                {price}
                              </TableCell>
                              <TableCell sx={{ color: 'text.primary' }}>
                                {changeDisplay}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default SearchStockView;