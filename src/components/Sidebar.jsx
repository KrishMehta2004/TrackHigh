import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getUniqueValues, getMonthOptions } from '../utils/dataProcessing';

const DRAWER_WIDTH = 320;

const Sidebar = ({ data, filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFilteredData = () => {
    if (filters.viewType === 'Specific Date📆' && filters.selectedDate) {
      return data.filter(row => {
        const rowDate = new Date(row["Today's Date"]);
        const selectedDate = new Date(filters.selectedDate);
        return rowDate.toDateString() === selectedDate.toDateString();
      });
    }
    return data;
  };

  const filteredData = getFilteredData();
  const availableSectors = ['All', ...getUniqueValues(filteredData, 'Sector')];
  const availableSeries = ['All', ...getUniqueValues(filteredData, 'Series Type')];
  const allSymbols = getUniqueValues(data, 'Symbol').sort();
  const monthOptions = getMonthOptions(data);

  const minDate = data.length > 0 ? new Date(Math.min(...data.map(d => new Date(d["Today's Date"])))) : new Date();
  const maxDate = data.length > 0 ? new Date(Math.max(...data.map(d => new Date(d["Today's Date"])))) : new Date();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'rgba(17, 24, 39, 0.95)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          p: 3
        },
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
        Filters
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: 'text.primary', mb: 2 }}>
          Select View Type
        </FormLabel>
        <RadioGroup
          value={filters.viewType}
          onChange={(e) => handleFilterChange('viewType', e.target.value)}
        >
          <FormControlLabel 
            value="Specific Date📆" 
            control={<Radio />} 
            label="Specific Date📆" 
          />
          <FormControlLabel 
            value="Date Range⏳" 
            control={<Radio />} 
            label="Date Range⏳" 
          />
          <FormControlLabel 
            value="Month📅" 
            control={<Radio />} 
            label="Month📅" 
          />
          <FormControlLabel 
            value="Search Stock🔎" 
            control={<Radio />} 
            label="Search Stock🔎" 
          />
        </RadioGroup>
      </FormControl>

      {filters.viewType === 'Specific Date📆' && (
        <Box sx={{ mb: 3 }}>
          <DatePicker
            label="Select Date"
            value={filters.selectedDate ? dayjs(filters.selectedDate) : null}
            onChange={(newValue) => handleFilterChange('selectedDate', newValue ? newValue.toDate() : null)}
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            sx={{ width: '100%', mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Sector:
            </Typography>
            <Select
              value={filters.selectedSectors}
              onChange={(e) => handleFilterChange('selectedSectors', e.target.value)}
              size="small"
            >
              {availableSectors.map(sector => (
                <MenuItem key={sector} value={sector}>{sector}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Series:
            </Typography>
            <Select
              value={filters.selectedSeries}
              onChange={(e) => handleFilterChange('selectedSeries', e.target.value)}
              size="small"
            >
              {availableSeries.map(series => (
                <MenuItem key={series} value={series}>{series}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {filters.viewType === 'Search Stock🔎' && (
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            multiple
            options={allSymbols}
            value={filters.searchSymbols}
            onChange={(event, newValue) => handleFilterChange('searchSymbols', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Stock Symbol"
                placeholder="Select stock symbols to analyze"
                size="small"
              />
            )}
          />
        </Box>
      )}

      {filters.viewType === 'Month📅' && (
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Select Month:
            </Typography>
            <Select
              value={filters.selectedMonth}
              onChange={(e) => handleFilterChange('selectedMonth', e.target.value)}
              size="small"
            >
              {monthOptions.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Sector:
            </Typography>
            <Select
              value={filters.selectedSectors}
              onChange={(e) => handleFilterChange('selectedSectors', e.target.value)}
              size="small"
            >
              {availableSectors.map(sector => (
                <MenuItem key={sector} value={sector}>{sector}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Series:
            </Typography>
            <Select
              value={filters.selectedSeries}
              onChange={(e) => handleFilterChange('selectedSeries', e.target.value)}
              size="small"
            >
              {availableSeries.map(series => (
                <MenuItem key={series} value={series}>{series}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Sort By:
            </Typography>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              size="small"
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Returns (High to Low)">Returns (High to Low)</MenuItem>
              <MenuItem value="Days Since High (Highest First)">Days Since High (Highest First)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {filters.viewType === 'Date Range⏳' && (
        <Box sx={{ mb: 3 }}>
          <DatePicker
            label="Start Date"
            value={filters.startDate ? dayjs(filters.startDate) : null}
            onChange={(newValue) => handleFilterChange('startDate', newValue ? newValue.toDate() : null)}
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            sx={{ width: '100%', mb: 2 }}
          />
          
          <DatePicker
            label="End Date"
            value={filters.endDate ? dayjs(filters.endDate) : null}
            onChange={(newValue) => handleFilterChange('endDate', newValue ? newValue.toDate() : null)}
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            sx={{ width: '100%', mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Sector:
            </Typography>
            <Select
              value={filters.selectedSectors}
              onChange={(e) => handleFilterChange('selectedSectors', e.target.value)}
              size="small"
            >
              {availableSectors.map(sector => (
                <MenuItem key={sector} value={sector}>{sector}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Series:
            </Typography>
            <Select
              value={filters.selectedSeries}
              onChange={(e) => handleFilterChange('selectedSeries', e.target.value)}
              size="small"
            >
              {availableSeries.map(series => (
                <MenuItem key={series} value={series}>{series}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Sort By:
            </Typography>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              size="small"
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Returns (High to Low)">Returns (High to Low)</MenuItem>
              <MenuItem value="Days Since High (Highest First)">Days Since High (Highest First)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;