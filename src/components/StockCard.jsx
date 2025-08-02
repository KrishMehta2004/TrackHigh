import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MetricContainer from './MetricContainer';
import { formatNumber, formatMetricValue } from '../utils/utilities';

const StockCard = ({ row }) => {
  const symbol = row['Symbol'];
  const price = formatNumber(row['LTP']);
  const priceChange = row['%chng'] || 0;
  const priceColor = priceChange >= 0 ? "#22C55E" : "#EF4444";
  const dateString = new Date(row["Today's Date"]).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });

  const priceChangeDisplay = priceChange !== null && priceChange !== undefined 
    ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`
    : "N/A";

  const TrendIcon = priceChange >= 0 ? TrendingUpIcon : TrendingDownIcon;

  // Safe value extraction with null checks
  const seriesType = row['Series Type'] || 'N/A';
  const sector = row['Sector'] || 'N/A';
  const industry = row['Industry'] || 'N/A';
  const marketCap = formatNumber(row['Market Cap']);
  const daysSinceHigh = formatMetricValue(row['Days Since High']);
  const peRatio = formatMetricValue(row['P/E Ratio']);
  const roe = formatMetricValue(row['ROE']);
  const latestPrice = formatNumber(row['Latest Price']);
  const returns = row['Returns'];
  const roce = formatMetricValue(row['ROCE']);

  const returnsDisplay = returns !== null && returns !== undefined
    ? `${returns >= 0 ? '+' : ''}${returns.toFixed(2)}%`
    : 'N/A';
  const returnsColor = returns >= 0 ? "#22C55E" : "#EF4444";

  return (
    <Box sx={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 4px 24px rgba(30,34,45,0.10)',
      p: { xs: 2, md: 3 },
      mb: 4,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.01)',
        boxShadow: '0 8px 32px rgba(30,34,45,0.18)'
      }
    }}>
      {/* Top Divider */}
      <Divider sx={{ mb: 3, bgcolor: '#A5B4FC', height: 4, borderRadius: 2 }} />
      
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        mb: 3,
        alignItems: 'flex-start'
      }}>
        <Box sx={{ flex: { xs: '1', lg: '2' } }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 }, 
              mb: 1,
              flexWrap: 'wrap'
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '24px', sm: '28px', md: '32px' },
                  fontWeight: 700,
                  color: '#A5B4FC',
                  lineHeight: 1.2
                }}
              >
                {symbol} <strong>({seriesType})</strong>
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Link
                  href={`https://www.screener.in/company/${symbol}`}
                  target="_blank"
                  sx={{
                    color: '#A5B4FC',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <SearchIcon fontSize="small" />
                  Screener
                </Link>
                
                <Link
                  href={`https://www.tradingview.com/chart/?symbol=NSE:${symbol}`}
                  target="_blank"
                  sx={{
                    color: '#60A5FA',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <ShowChartIcon fontSize="small" />
                  TradingView
                </Link>
              </Box>
            </Box>
            
            <Typography sx={{ 
              color: '#E2E8F0', 
              mb: 1,
              fontSize: { xs: '14px', sm: '16px' }
            }}>
              <strong>Sector:</strong> {sector}
            </Typography>
            
            <Typography sx={{ 
              color: '#E2E8F0',
              fontSize: { xs: '14px', sm: '16px' }
            }}>
              <strong>Industry:</strong> {industry}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          flex: { xs: '1', lg: '1' },
          textAlign: { xs: 'left', lg: 'right' },
          mt: { xs: 2, lg: 0 }
        }}>
          <Box
            className="price-section-hover"
            sx={{
              textAlign: 'right',
              width: '180%',
              transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
              borderRadius: '8px',
              p: 1,
              '&:hover': {
                backgroundColor: 'rgba(51, 65, 85, 0.98)',
                boxShadow: '0 6px 24px rgba(30,34,45,0.18)',
                transform: 'scale(1.03)'
              }
            }}
          >
            <Typography variant="h3" sx={{ fontSize: 30, fontWeight: 700, color: 'white' }}>{price}</Typography>
            <Typography variant="h5" sx={{ fontSize: 20, fontWeight: 600, color: priceColor }}>{priceChangeDisplay}</Typography>
          </Box>
          <TrendIcon sx={{ color: priceColor, fontSize: { xs: '18px', sm: '20px', md: '22px' } }} />
        </Box>
      </Box>

      {/* Metrics Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr',
          lg: '1fr 1fr 1fr'
        },
        gap: { xs: 2, md: 3 },
        width: '100%',
        mt: 1,
        mb: 2
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <MetricContainer
            label="Market Cap"
            value={marketCap}
            color="#A5B4FC"
          />
          <MetricContainer
            label="Days Since New High"
            value={daysSinceHigh}
            color="#BAE6FD"
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <MetricContainer
            label="Stock P/E"
            value={peRatio}
            color="#93C5FD"
          />
          <MetricContainer
            label="ROE"
            value={roe}
            unit="%"
            color="#FDA4AF"
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          gridColumn: { xs: '1', md: '1 / -1', lg: 'auto' }
        }}>
          <MetricContainer
            label="Latest Price & Returns"
            value={`<span style="color:white;">${latestPrice}</span> (<span style="color:${returnsColor};">${returnsDisplay}</span>)`}
            color="white"
          />
          <MetricContainer
            label="ROCE"
            value={roce}
            unit="%"
          />
        </Box>
      </Box>

      {/* About Section */}
      {row['About'] && (
        <Box
          className="about-section-hover"
          sx={{
            mt: 3,
            p: 2,
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.10)',
            transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
            boxShadow: '0 2px 12px rgba(30,34,45,0.10)',
            '&:hover': {
              background: 'rgba(51, 65, 85, 0.98)',
              boxShadow: '0 6px 24px rgba(30,34,45,0.18)',
              transform: 'scale(1.03)'
            }
          }}
        >
          <Typography sx={{ color: '#A5B4FC', fontSize: 16, fontWeight: 600, mb: 1 }}>
            About
          </Typography>
          <Typography sx={{ color: '#FFFFFF', fontSize: 20, lineHeight: 1.6 }}>
            {row['About']}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StockCard;