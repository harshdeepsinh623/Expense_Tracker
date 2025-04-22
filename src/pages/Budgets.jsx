import React, { useState } from 'react';
import { Box, Paper, Grid, Typography, Button, Avatar, IconButton, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { AddIcon, EditIcon, DeleteIcon } from '../icons';
import { CategoryIcon } from '../icons';

const Budgets = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [filteredBudgets, setFilteredBudgets] = useState([]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getCategoryById = (id) => {
    // Implementation of getCategoryById
  };

  const getTotalSpentByCategory = (category) => {
    // Implementation of getTotalSpentByCategory
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">Budget Planner</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          size="small"
        >
          Add Budget
        </Button>
      </Box>

      {/* Budget Summary */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Total Budget</Typography>
              <Typography variant="h3" color="primary">
                {currencyFormatter.format(budgetStats.totalBudget)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Total Spent</Typography>
              <Typography variant="h3" color={budgetStats.totalSpent > budgetStats.totalBudget ? 'error' : 'success'}>
                {currencyFormatter.format(budgetStats.totalSpent)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Remaining</Typography>
              <Typography variant="h3" color={budgetStats.remaining < 0 ? 'error' : 'info'}>
                {currencyFormatter.format(budgetStats.remaining)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" gutterBottom>Overall Spending ({budgetStats.spendingPercentage.toFixed(0)}%)</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(budgetStats.spendingPercentage, 100)} 
                    color={budgetStats.spendingPercentage > 100 ? 'error' : budgetStats.spendingPercentage > 80 ? 'warning' : 'success'}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {Math.min(budgetStats.spendingPercentage, 100).toFixed(0)}%
                  {budgetStats.spendingPercentage > 100 && ` (${(budgetStats.spendingPercentage - 100).toFixed(0)}% over)`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Budget Categories */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Budget Categories</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="budget-month-label">Month</InputLabel>
            <Select
              labelId="budget-month-label"
              value={selectedMonth}
              label="Month"
              onChange={handleMonthChange}
            >
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
          {filteredBudgets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="textSecondary">
                No budgets created for this month.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Click "Add Budget" to create a new budget category.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredBudgets.map((budget) => {
                const categoryData = getCategoryById(budget.category);
                const spent = getTotalSpentByCategory(budget.category);
                const remaining = budget.amount - spent;
                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                
                return (
                  <Grid item xs={12} md={6} key={budget.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: categoryData?.color || 'primary.main',
                              color: 'white',
                              width: 32,
                              height: 32,
                              mr: 1
                            }}
                          >
                            {categoryData?.icon || <CategoryIcon />}
                          </Avatar>
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {categoryData?.name || 'Category'}
                          </Typography>
                          <IconButton 
                            size="small" 
                            aria-label="edit" 
                            onClick={() => handleEditBudget(budget)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            aria-label="delete" 
                            onClick={() => handleDeleteBudget(budget.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Budget</Typography>
                            <Typography variant="body1">{currencyFormatter.format(budget.amount)}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Spent</Typography>
                            <Typography 
                              variant="body1" 
                              color={spent > budget.amount ? 'error.main' : 'text.primary'}
                            >
                              {currencyFormatter.format(spent)}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Remaining</Typography>
                            <Typography 
                              variant="body1"
                              color={remaining < 0 ? 'error.main' : 'success.main'}
                            >
                              {currencyFormatter.format(remaining)}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">
                              {percentage.toFixed(0)}% used
                            </Typography>
                            {percentage > 100 && (
                              <Typography variant="body2" color="error.main">
                                {(percentage - 100).toFixed(0)}% over budget
                              </Typography>
                            )}
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(percentage, 100)} 
                            color={
                              percentage > 100 
                                ? 'error' 
                                : percentage > 80 
                                  ? 'warning' 
                                  : 'success'
                            }
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Budgets; 