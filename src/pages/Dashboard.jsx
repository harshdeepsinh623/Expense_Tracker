import React, { useState } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button, 
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  useTheme,
  Paper,
  Tooltip,
  Stack,
  Chip,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAppContext } from '../contexts/AppContext';
import { MonthlyChart, CategoryPieChart } from '../components/Charts';
import StatsCard from '../components/StatsCard';
import { formatCurrency, getFormattedDate } from '../utils/formatters';

const Dashboard = () => {
  const { 
    expenses, 
    currentMonthTotal,
    currentMonthIncome,
    lastMonthTotal,
    lastMonthIncome,
    totalExpenses,
    totalIncome,
    avgMonthlyExpense,
    avgMonthlyIncome,
    getPercentageChange,
    getTrendIcon,
    toggleExpenseDialog,
    toggleConfirmDeleteDialog,
    useINR,
    toggleCurrency,
    expensesByCategory,
    categories,
    printExpenseReport
  } = useAppContext();
  
  const theme = useTheme();
  const [chartView, setChartView] = useState('monthly');
  const [timeFrame, setTimeFrame] = useState('month');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const handleChangeChartView = (event, newView) => {
    if (newView !== null) {
      setChartView(newView);
    }
  };
  
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleExportChart = () => {
    printExpenseReport();
    handleMenuClose();
  };
  
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };
  
  // Get most recent 5 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Calculate month to month percentage change
  const expenseChangePercent = getPercentageChange(lastMonthTotal, currentMonthTotal);
  const expenseTrend = getTrendIcon(expenseChangePercent);
  
  const incomeChangePercent = getPercentageChange(lastMonthIncome, currentMonthIncome);
  const incomeTrend = {
    icon: incomeChangePercent > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />,
    color: incomeChangePercent > 0 ? '#4caf50' : '#f44336' // Green for increasing income, red for decreasing
  };
  
  // Get top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3)
    .map(([categoryId, amount]) => {
      const category = categories.find(cat => cat.id === categoryId) || { name: categoryId, color: '#bdbdbd' };
      return {
        name: category.name,
        amount,
        color: category.color
      };
    });
  
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      p: { xs: 1, sm: 2 }
    }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
          <Tooltip title={useINR ? "Switch to USD" : "Switch to INR"}>
            <Chip
              icon={useINR ? <CurrencyRupeeIcon /> : <AttachMoneyIcon />}
              label={useINR ? "INR" : "USD"}
              color="primary"
              variant="outlined"
              onClick={toggleCurrency}
              size="small"
            />
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            color="success" 
            onClick={() => toggleExpenseDialog({ isIncome: true })}
            startIcon={<ArrowUpwardIcon />}
          >
            Add Income
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => toggleExpenseDialog()}
            startIcon={<ArrowDownwardIcon />}
          >
            Add Expense
          </Button>
        </Stack>
      </Box>
      
      {/* Stats Cards - First Row: Income */}
      <Typography variant="h6" sx={{ mb: 1, mt: 1 }}>Income Summary</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Current Month Income"
            value={formatCurrency(currentMonthIncome, 'USD', useINR)}
            icon={incomeTrend.icon}
            iconColor={incomeTrend.color}
            subtitle={`${incomeChangePercent > 0 ? '+' : ''}${incomeChangePercent}% from last month`}
            trend={incomeChangePercent > 0 ? 'up_good' : 'down_bad'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Last Month Income"
            value={formatCurrency(lastMonthIncome, 'USD', useINR)}
            icon={<ArrowUpwardIcon />}
            iconColor={theme.palette.success.main}
            subtitle="Previous month income"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Avg Income"
            value={formatCurrency(avgMonthlyIncome, 'USD', useINR)}
            icon={<BarChartIcon />}
            iconColor={theme.palette.info.main}
            subtitle="Based on all income"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Income"
            value={formatCurrency(totalIncome, 'USD', useINR)}
            icon={<ArrowUpwardIcon />}
            iconColor={theme.palette.success.main}
            subtitle="Lifetime income"
          />
        </Grid>
      </Grid>
      
      {/* Net Balance Section */}
      <Box sx={{ 
        my: 3, 
        p: 2, 
        borderRadius: 2, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(58, 65, 111, 0.2)' : 'rgba(235, 241, 255, 0.7)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(58, 65, 111, 0.5)' : 'rgba(200, 220, 252, 0.8)'}`,
        boxShadow: theme.shadows[1]
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Current Month Balance</Typography>
            <Typography variant="body2" color="text.secondary">
              Income minus expenses for this month
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              color={currentMonthIncome - currentMonthTotal > 0 ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              {formatCurrency(currentMonthIncome - currentMonthTotal, 'USD', useINR)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ 
                width: '100%', 
                maxWidth: '200px', 
                height: '8px', 
                bgcolor: 'grey.200', 
                borderRadius: 4, 
                overflow: 'hidden',
                mr: 2
              }}>
                <Box 
                  sx={{ 
                    height: '100%', 
                    width: `${Math.min(currentMonthIncome > 0 ? (currentMonthTotal/currentMonthIncome)*100 : 0, 100)}%`,
                    bgcolor: currentMonthIncome > currentMonthTotal ? 'success.main' : 'error.main',
                    borderRadius: 4
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {currentMonthIncome > 0 
                  ? `${Math.round((currentMonthTotal/currentMonthIncome)*100)}% used` 
                  : '0% used'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Stats Cards - Second Row: Expenses */}
      <Typography variant="h6" sx={{ mb: 1 }}>Expense Summary</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Current Month Expense"
            value={formatCurrency(currentMonthTotal, 'USD', useINR)}
            icon={expenseTrend.icon}
            iconColor={expenseTrend.color}
            subtitle={`${expenseChangePercent > 0 ? '+' : ''}${expenseChangePercent}% from last month`}
            trend={expenseChangePercent > 0 ? 'up' : 'down'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Last Month Expense"
            value={formatCurrency(lastMonthTotal, 'USD', useINR)}
            icon={<ArrowDownwardIcon />}
            iconColor={theme.palette.error.main}
            subtitle="Previous month expense"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Avg Expense"
            value={formatCurrency(avgMonthlyExpense, 'USD', useINR)}
            icon={<DonutLargeIcon />}
            iconColor={theme.palette.warning.main}
            subtitle="Based on all expenses"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses, 'USD', useINR)}
            icon={<TrendingUpIcon />}
            iconColor={theme.palette.error.main}
            subtitle="Lifetime expenses"
          />
        </Grid>
      </Grid>
      
      {/* Charts and Recent Expenses */}
      <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 0, mb: 0 }}>
        {/* Expense Overview Charts */}
        <Grid item xs={12} md={8} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: { xs: '50vh', md: '100%' } 
        }}>
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '150%', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6" fontWeight="bold">Expense Overview</Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexWrap: 'wrap',
                '@media (max-width: 600px)': {
                  width: '100%',
                  justifyContent: 'space-between'
                }
              }}>
                <FormControl size="small" sx={{ minWidth: 110 }}>
                  <InputLabel id="time-frame-label">Time Frame</InputLabel>
                  <Select
                    labelId="time-frame-label"
                    id="time-frame-select"
                    value={timeFrame}
                    label="Time Frame"
                    onChange={handleTimeFrameChange}
                  >
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                  </Select>
                </FormControl>
                
                <ToggleButtonGroup
                  value={chartView}
                  exclusive
                  onChange={handleChangeChartView}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="monthly" aria-label="Monthly view">
                    <Tooltip title="Bar Chart">
                      <BarChartIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="category" aria-label="Category view">
                    <Tooltip title="Pie Chart">
                      <DonutLargeIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="trend" aria-label="Trend view">
                    <Tooltip title="Line Chart">
                      <LineAxisIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleExportChart}>
                    <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                    Export Report
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            
            {/* Summary Metrics */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: theme.palette.background.default,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">Monthly Average</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatCurrency(avgMonthlyExpense, 'USD', useINR)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: theme.palette.background.default,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">Current vs Last</Typography>
                    <Typography variant="h6" fontWeight="bold" color={expenseChangePercent > 0 ? 'error.main' : 'success.main'} sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {expenseChangePercent > 0 ? '+' : ''}{expenseChangePercent}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: theme.palette.background.default,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">Expense/Income Ratio</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {currentMonthIncome ? Math.round((currentMonthTotal / currentMonthIncome) * 100) : 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            {/* Top Categories */}
            {chartView === 'category' && (
              <Box sx={{ mb: 2, maxHeight: '150px', overflow: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Top Spending Categories</Typography>
                <Stack spacing={1}>
                  {topCategories.map(category => (
                    <Box 
                      key={category.name} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 0.75,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: theme.palette.action.hover
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: category.color, 
                          mr: 1,
                          flexShrink: 0
                        }} />
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {category.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium" sx={{ flexShrink: 0 }}>
                        {formatCurrency(category.amount, 'USD', useINR)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            {/* Chart Container and Caption Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              {/* Chart Container */}
              <Box sx={{ 
                flexGrow: 1, 
                minHeight: { xs: '200px', sm: '250px' }, 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {chartView === 'monthly' && (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    <MonthlyChart expenses={expenses} />
                  </Box>
                )}
                {chartView === 'category' && (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    <CategoryPieChart expenses={expenses} />
                  </Box>
                )}
                {chartView === 'trend' && (
                  // Placeholder for the trend chart
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'text.secondary'
                  }}>
                    <LineAxisIcon sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                    <Typography>Spending Trend Analysis</Typography>
                    <Typography variant="caption">Shows expense trends over {timeFrame}</Typography>
                  </Box>
                )}
              </Box>
              
              {/* Chart Caption Below */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                    px: 2,
                    py: 0.75,
                    borderRadius: 8,
                    textAlign: 'center'
                  }}
                >
                  Showing data for {timeFrame === 'week' ? 'this week' : 
                    timeFrame === 'month' ? 'this month' :
                    timeFrame === 'quarter' ? 'this quarter' : 'this year'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Expenses */}
        <Grid item xs={12} md={4} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: { xs: '40vh', md: '100%' } 
        }}>
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Recent Expenses</Typography>
              <Button 
                variant="text" 
                size="small" 
                color="primary" 
                endIcon={<MoreHorizIcon />}
                onClick={() => window.location.href = '/transactions'}
              >
                View All
              </Button>
            </Box>
            
            {/* Summary info */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: theme.palette.background.default,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">Latest Entry</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {recentExpenses.length > 0 
                        ? getFormattedDate(recentExpenses[0].date) 
                        : 'No entries'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: theme.palette.background.default,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">Total Entries</Typography>
                    <Typography variant="body2" fontWeight="medium">{expenses.length}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', px: 0.5, mt: 1 }}>
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense, index) => (
                  <Box 
                    key={expense.id} 
                    sx={{ 
                      mb: index === recentExpenses.length - 1 ? 0 : 1.5,
                      bgcolor: expense.isIncome 
                        ? `${theme.palette.success.main}10`
                        : `${theme.palette.error.main}08`,
                      borderRadius: 1,
                      p: { xs: 1.25, sm: 1.5 },
                      border: `1px solid ${expense.isIncome 
                        ? `${theme.palette.success.main}30` 
                        : `${theme.palette.error.main}25`}`,
                      '&:hover': {
                        bgcolor: expense.isIncome 
                          ? `${theme.palette.success.main}15`
                          : `${theme.palette.error.main}12`,
                        boxShadow: theme.shadows[1]
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ maxWidth: '65%' }}>
                        <Typography 
                          fontWeight="medium" 
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {expense.title || expense.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          {/* Display category color dot */}
                          {categories.find(cat => cat.id === expense.category) && (
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: categories.find(cat => cat.id === expense.category)?.color || '#bdbdbd',
                                mr: 0.5,
                                flexShrink: 0
                              }} 
                            />
                          )}
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {expense.category} • {getFormattedDate(expense.date)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', ml: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography 
                          fontWeight="bold" 
                          color={expense.isIncome ? theme.palette.success.main : theme.palette.error.main}
                        >
                          {expense.isIncome ? '+' : ''}{formatCurrency(expense.amount, 'USD', useINR)}
                        </Typography>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              sx={{ mr: 0.5 }}
                              onClick={() => toggleExpenseDialog(expense)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small"
                              onClick={() => toggleConfirmDeleteDialog(
                                expense.id,
                                'expense',
                                `Are you sure you want to delete "${expense.title || expense.description}"?`
                              )}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>No recent expenses</Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => toggleExpenseDialog()}
                    startIcon={<ArrowDownwardIcon />}
                  >
                    Add New Expense
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 