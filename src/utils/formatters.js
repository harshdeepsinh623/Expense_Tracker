import { format, parseISO } from 'date-fns';

// Exchange rate from USD to INR (approximate)
const USD_TO_INR_RATE = 83;

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {boolean} convertToINR - Whether to convert from USD to INR
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD', convertToINR = false) => {
  // Convert the amount to INR if required
  const finalAmount = convertToINR ? (amount * USD_TO_INR_RATE) : amount;
  const finalCurrency = convertToINR ? 'INR' : currency;
  
  return new Intl.NumberFormat(convertToINR ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: finalCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(finalAmount || 0);
};

/**
 * Format a number as Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency in INR
 */
export const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

/**
 * Format a date string to display format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const getFormattedDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format a date as relative time (today, yesterday, etc)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative date
 */
export const getRelativeDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    
    // Check if date is today
    if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
      return 'Today';
    }
    
    // Check if date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    }
    
    // Return formatted date for other dates
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format a number with specified decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
  return (value || 0).toFixed(decimals);
}; 