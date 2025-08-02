import Papa from 'papaparse';

export const loadData = async () => {
    try {
    const url = "https://raw.githubusercontent.com/KrishMehta2004/TrackHigh_Data/refs/heads/main/Data.csv";
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const processedData = results.data.map(row => {
              // Parse date
              if (row["Today's Date"]) {
                row["Today's Date"] = parseDate(row["Today's Date"]);
              }

              // Clean percentage change column
              if (row['%chng']) {
                row['%chng'] = parseFloat(row['%chng'].toString().replace('%', '').trim()) || 0;
              }

              // Calculate returns
              const latestPrice = parseFloat(row['Latest Price']) || 0;
              const ltp = parseFloat(row['LTP']) || 0;
              if (latestPrice && ltp) {
                row['Returns'] = Math.round((latestPrice - ltp) * 100 / ltp * 100) / 100;
              }

              // Clean numeric columns
              const numericColumns = ['ROE', 'ROCE', 'P/E Ratio', 'Book Value', 'Dividend Yield'];
              numericColumns.forEach(col => {
                if (row[col]) {
                  const cleanValue = row[col].toString().replace('%', '').replace('₹', '').trim();
                  row[col] = parseFloat(cleanValue) || null;
                }
              });

              // Clean Market Cap column
              if (row['Market Cap']) {
                const cleanValue = row['Market Cap'].toString().replace('₹', '').replace(/,/g, '').trim();
                const match = cleanValue.match(/(\d+(?:\.\d+)?)/);
                row['Market Cap'] = match ? parseFloat(match[1]) : null;
              }

              // Clean Symbol column
              if (row['Symbol']) {
                row['Symbol'] = row['Symbol'].toString().trim().toUpperCase();
              }

              // Handle Series Type
              row['Series Type'] = row['Series Type'] || 'N/A';

              return row;
            });

            // Filter out failed sectors
            const filteredData = processedData.filter(row => 
              row['Sector'] && row['Sector'].toString().toLowerCase() !== 'failed'
            );

            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

const parseDate = (dateString) => {
  try {
    // Handle format like "01-Dec-24"
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const month = monthMap[parts[1]];
      const year = 2000 + parseInt(parts[2]); // Assuming 2-digit year
      
      if (month !== undefined) {
        return new Date(year, month, day);
      }
    }
    
    // Fallback to standard date parsing
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date();
  }
};