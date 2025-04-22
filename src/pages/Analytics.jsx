import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  Divider, 
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAppContext } from '../contexts/AppContext';

const Analytics = () => {
  const { 
    incomeTotal,
    expenseTotal,
    balance,
    currentMonthYearDisplay,
    budgetStatus,
    expensesByCategory,
    getCategoryById,
    getCategoryBudgetStatus,
    weeklyData,
    getTrend,
    toggleBudgetDialog
  } = useAppContext();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">Analytics for {currentMonthYearDisplay}</Typography>
        <Button 
          startIcon={<BarChartIcon />} 
          variant="outlined"
          onClick={toggleBudgetDialog}
        >
          Manage Budgets
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Monthly Overview</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Total Income:</Typography>
              <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                ${incomeTotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Total Expenses:</Typography>
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                ${expenseTotal.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Net Balance:</Typography>
              <Typography variant="body1" sx={{ 
                color: balance >= 0 ? 'success.main' : 'error.main', 
                fontWeight: 'bold' 
              }}>
                ${balance.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Spending by Week</Typography>
            <Box sx={{ mb: 3 }}>
              <List>
                {weeklyData.map((week, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={week.week} 
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="text.primary">
                            Income: ${week.income.toFixed(2)}
                          </Typography>
                          {' | '}
                          <Typography variant="body2" component="span" color="text.primary">
                            Expenses: ${week.expenses.toFixed(2)}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ width: '40%' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(week.expenses / Math.max(budgetStatus.total / 4, 1)) * 100}
                        color={week.expenses > (budgetStatus.total / 4) ? "error" : "primary"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Category Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Category Spending</Typography>
            <Box sx={{ height: 300, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                [Pie chart visualization would be rendered here]
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>Budget Status by Category</Typography>
            {Object.keys(expensesByCategory).length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No spending in any category yet this month.
              </Typography>
            ) : (
              Object.keys(expensesByCategory).map(categoryId => {
                const categoryData = getCategoryById(categoryId);
                const budgetStatus = getCategoryBudgetStatus(categoryId);
                
                return (
                  <Box key={categoryId} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>{categoryData.icon}</Typography>
                        <Typography variant="body2">{categoryData.name}</Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: budgetStatus.isOverBudget ? 'error.main' : 'text.primary',
                          fontWeight: budgetStatus.isOverBudget ? 'bold' : 'normal'
                        }}
                      >
                        ${expensesByCategory[categoryId].toFixed(2)} / ${budgetStatus.total}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={budgetStatus.percentage}
                      color={budgetStatus.isOverBudget ? "error" : "primary"}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                );
              })
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Overall Budget</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1">
                  ${expenseTotal.toFixed(2)} / ${budgetStatus.total.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: budgetStatus.percentage > 90 ? 'error.main' : 'text.secondary' }}>
                  {Math.round(budgetStatus.percentage)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={budgetStatus.percentage} 
                color={budgetStatus.percentage > 90 ? "error" : "primary"}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                ${budgetStatus.remaining.toFixed(2)} remaining
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Analytics; 