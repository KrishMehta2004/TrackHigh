export const getUniqueValues = (data, column) => {
  const values = data
    .map(row => row[column])
    .filter(value => value && value !== 'N/A' && value !== 'nan')
    .filter((value, index, self) => self.indexOf(value) === index);
  
  return values.sort();
};

export const getMonthOptions = (data) => {
  const months = data.map(row => {
    const date = new Date(row["Today's Date"]);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });
  
  return [...new Set(months)].sort((a, b) => {
    return new Date(a) - new Date(b);
  });
};

export const filterData = (data, filters) => {
  let filtered = [...data];

  // Filter by view type and date
  if (filters.viewType === 'Specific Date📆' && filters.selectedDate) {
    filtered = filtered.filter(row => {
      const rowDate = new Date(row["Today's Date"]);
      const selectedDate = new Date(filters.selectedDate);
      return rowDate.toDateString() === selectedDate.toDateString();
    });
  } else if (filters.viewType === 'Month📅' && filters.selectedMonth) {
    filtered = filtered.filter(row => {
      const date = new Date(row["Today's Date"]);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return monthYear === filters.selectedMonth;
    });
  } else if (filters.viewType === 'Date Range⏳' && filters.startDate && filters.endDate) {
    filtered = filtered.filter(row => {
      const rowDate = new Date(row["Today's Date"]);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      return rowDate >= startDate && rowDate <= endDate;
    });
  }

  // Filter by sector
  if (filters.selectedSectors && filters.selectedSectors !== 'All') {
    filtered = filtered.filter(row => row['Sector'] === filters.selectedSectors);
  }

  // Filter by series
  if (filters.selectedSeries && filters.selectedSeries !== 'All') {
    filtered = filtered.filter(row => row['Series Type'] === filters.selectedSeries);
  }

  return filtered;
};

export const applySorting = (data, sortOption) => {
  if (!sortOption || sortOption === 'None') {
    return data;
  }

  const sortedData = [...data];

  switch (sortOption) {
    case 'Returns (High to Low)':
      return sortedData.sort((a, b) => {
        const aReturns = a['Returns'] || a['%chng'] || 0;
        const bReturns = b['Returns'] || b['%chng'] || 0;
        return bReturns - aReturns;
      });
    
    case 'Days Since High (Highest First)':
    case 'Days Since New High (High to low)':
      return sortedData.sort((a, b) => {
        const aDays = a['Days Since High'] || 0;
        const bDays = b['Days Since High'] || 0;
        return bDays - aDays;
      });
    
    case 'Mcap (low to high)':
      return sortedData.sort((a, b) => {
        const aMarketCap = a['Market Cap'] || 0;
        const bMarketCap = b['Market Cap'] || 0;
        return aMarketCap - bMarketCap;
      });
    
    case 'P/E (low to high)':
      return sortedData.sort((a, b) => {
        const aPE = a['P/E Ratio'] || Infinity;
        const bPE = b['P/E Ratio'] || Infinity;
        return aPE - bPE;
      });
    
    default:
      return sortedData;
  }
};

export const getLatestStockData = (data) => {
  if (!data || data.length === 0) return [];

  // Group by symbol and get the latest date for each
  const latestDates = {};
  data.forEach(row => {
    const symbol = row['Symbol'];
    const date = new Date(row["Today's Date"]);
    
    if (!latestDates[symbol] || date > latestDates[symbol].date) {
      latestDates[symbol] = { date, row };
    }
  });

  // Return the latest data for each stock
  return Object.values(latestDates).map(item => item.row);
};

export const getStockHighs = (data, symbol) => {
  const stockData = data.filter(row => row['Symbol'] === symbol);
  
  if (stockData.length === 0) {
    return { highDates: [], stockData: [] };
  }

  // Sort by date
  const sortedData = stockData.sort((a, b) => new Date(a["Today's Date"]) - new Date(b["Today's Date"]));
  
  // Get high dates (assuming High52W column indicates high dates)
  const highDates = sortedData.filter(row => row['High52W'] === 'Yes');
  
  return { highDates, stockData: sortedData };
};