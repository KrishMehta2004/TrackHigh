export const formatMetricValue = (value, precision = 2) => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return "N/A";
    }
    
    if (typeof value === 'string') {
      const cleanValue = value.replace('₹', '').replace(',', '').trim();
      const numValue = parseFloat(cleanValue);
      if (isNaN(numValue)) return "N/A";
      return numValue.toFixed(precision);
    }
    
    return parseFloat(value).toFixed(precision);
  } catch (error) {
    return "N/A";
  }
};

export const formatNumber = (num) => {
  try {
    if (num === null || num === undefined || isNaN(num)) {
      return "N/A";
    }
    
    let numValue = num;
    if (typeof num === 'string') {
      numValue = parseFloat(num.replace('₹', '').replace(/,/g, '').trim());
      if (isNaN(numValue)) return "N/A";
    }
    
    if (numValue >= 1e9) {
      return `₹${(numValue / 1e9).toFixed(2)}B`;
    } else if (numValue >= 1e7) {
      return `₹${(numValue / 1e7).toFixed(2)}Cr`;
    } else if (numValue >= 1e5) {
      return `₹${(numValue / 1e5).toFixed(2)}L`;
    } else {
      return `₹${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  } catch (error) {
    return "N/A";
  }
};