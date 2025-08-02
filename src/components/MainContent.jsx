import React from 'react';
import { Box } from '@mui/material';
import SpecificDateView from './views/SpecificDateView';
import SearchStockView from './views/SearchStockView';
import MonthView from './views/MonthView';
import DateRangeView from './views/DateRangeView';
import { filterData } from '../utils/dataProcessing';

const MainContent = ({ data, filters, setFilters }) => {
  const filteredData = filterData(data, filters);

  const renderView = () => {
    switch (filters.viewType) {
      case 'Specific Date📆':
        return (
          <SpecificDateView 
            data={filteredData} 
            filters={filters}
            setFilters={setFilters}
            selectedDate={filters.selectedDate}
          />
        );
      case 'Search Stock🔎':
        return (
          <SearchStockView 
            data={data} 
            searchSymbols={filters.searchSymbols}
          />
        );
      case 'Month📅':
        return (
          <MonthView 
            data={filteredData} 
            selectedMonth={filters.selectedMonth}
          />
        );
      case 'Date Range⏳':
        return (
          <DateRangeView 
            data={filteredData} 
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {renderView()}
    </Box>
  );
};

export default MainContent;