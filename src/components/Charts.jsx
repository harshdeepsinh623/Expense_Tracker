import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useAppContext } from '../contexts/AppContext';

// USD to INR conversion rate
const USD_TO_INR_RATE = 83;

// Monthly Chart Component - Bar Chart for Monthly Expenses
export const MonthlyChart = ({ expenses }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const { useINR } = useAppContext();
  
  // Function to group expenses by month
  const getMonthlyData = () => {
    const monthlyTotals = {};
    
    // Group expenses by month
    expenses.forEach(expense => {
      const date = parseISO(expense.date);
      const monthKey = format(date, 'MMM yyyy');
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      
      monthlyTotals[monthKey] += expense.amount;
    });
    
    // Convert to array and sort by date
    return Object.entries(monthlyTotals)
      .slice(-6) // Only show last 6 months
      .map(([month, total]) => ({
        month,
        total: useINR ? total * USD_TO_INR_RATE : total
      }));
  };
  
  useEffect(() => {
    if (chartRef.current) {
      const data = getMonthlyData();
      renderBarChart(data);
    }
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expenses, useINR]);
  
  // Handle window resize
  const handleResize = () => {
    if (chartRef.current) {
      const data = getMonthlyData();
      renderBarChart(data);
    }
  };
  
  // Render bar chart using HTML/CSS (placeholder for actual chart library)
  const renderBarChart = (data) => {
    const container = chartRef.current;
    const maxValue = Math.max(...data.map(item => item.total), 0);
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.display = 'flex';
    chartContainer.style.alignItems = 'flex-end';
    chartContainer.style.justifyContent = 'space-between';
    chartContainer.style.height = '100%';
    chartContainer.style.width = '100%';
    chartContainer.style.paddingBottom = '24px';
    
    // Create bars for each month
    data.forEach(item => {
      const barContainer = document.createElement('div');
      barContainer.style.display = 'flex';
      barContainer.style.flexDirection = 'column';
      barContainer.style.alignItems = 'center';
      barContainer.style.flex = '1';
      
      const barHeight = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
      
      const bar = document.createElement('div');
      bar.style.width = '80%';
      bar.style.height = `${barHeight}%`;
      bar.style.backgroundColor = theme.palette.primary.main;
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.transition = 'height 0.3s ease';
      bar.style.position = 'relative';
      
      const label = document.createElement('div');
      label.innerText = item.month;
      label.style.marginTop = '8px';
      label.style.fontSize = '12px';
      label.style.color = theme.palette.text.secondary;
      
      const value = document.createElement('div');
      value.innerText = useINR 
        ? `₹${Math.round(item.total)}`
        : `$${Math.round(item.total)}`;
      value.style.position = 'absolute';
      value.style.top = '-20px';
      value.style.left = '50%';
      value.style.transform = 'translateX(-50%)';
      value.style.fontSize = '10px';
      value.style.color = theme.palette.text.primary;
      value.style.fontWeight = 'bold';
      
      bar.appendChild(value);
      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      chartContainer.appendChild(barContainer);
    });
    
    container.appendChild(chartContainer);
  };
  
  return (
    <Box 
      ref={chartRef} 
      sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

// Category Pie Chart Component
export const CategoryPieChart = ({ expenses }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const { useINR } = useAppContext();
  
  // Function to group expenses by category
  const getCategoryData = () => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      
      categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total: useINR ? total * USD_TO_INR_RATE : total
    }));
  };
  
  useEffect(() => {
    if (chartRef.current) {
      const data = getCategoryData();
      renderPieChart(data);
    }
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expenses, useINR]);
  
  // Handle window resize
  const handleResize = () => {
    if (chartRef.current) {
      const data = getCategoryData();
      renderPieChart(data);
    }
  };
  
  // Render simple pie chart using HTML/CSS (placeholder for actual chart library)
  const renderPieChart = (data) => {
    const container = chartRef.current;
    const totalAmount = data.reduce((sum, item) => sum + item.total, 0);
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create pie chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'relative';
    chartContainer.style.width = '200px';
    chartContainer.style.height = '200px';
    chartContainer.style.borderRadius = '50%';
    chartContainer.style.background = 'conic-gradient(#8884d8 0% 25%, #82ca9d 25% 56%, #ffc658 56% 100%)';
    
    // Create legend
    const legend = document.createElement('div');
    legend.style.display = 'flex';
    legend.style.flexWrap = 'wrap';
    legend.style.justifyContent = 'center';
    legend.style.marginTop = '20px';
    
    // Generate random colors for pie chart sections
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main
    ];
    
    // Create legend items for each category
    data.forEach((item, index) => {
      const percentage = totalAmount > 0 ? (item.total / totalAmount) * 100 : 0;
      const color = colors[index % colors.length];
      
      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.margin = '0 10px 10px 0';
      
      const colorBox = document.createElement('div');
      colorBox.style.width = '12px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = color;
      colorBox.style.marginRight = '5px';
      
      const label = document.createElement('span');
      const currencySymbol = useINR ? '₹' : '$';
      label.innerText = `${item.category}: ${percentage.toFixed(1)}% (${currencySymbol}${Math.round(item.total)})`;
      label.style.fontSize = '12px';
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legend.appendChild(legendItem);
    });
    
    const pieChartWrapper = document.createElement('div');
    pieChartWrapper.style.display = 'flex';
    pieChartWrapper.style.flexDirection = 'column';
    pieChartWrapper.style.alignItems = 'center';
    pieChartWrapper.style.width = '100%';
    
    pieChartWrapper.appendChild(chartContainer);
    pieChartWrapper.appendChild(legend);
    
    container.appendChild(pieChartWrapper);
  };
  
  return (
    <Box 
      ref={chartRef} 
      sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
}; 