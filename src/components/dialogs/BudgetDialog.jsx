import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  InputAdornment,
  Divider
} from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

const BudgetDialog = () => {
  const {
    openBudgetDialog,
    toggleBudgetDialog,
    categories,
    budgets,
    handleUpdateBudgets
  } = useAppContext();

  const totalBudget = Object.values(budgets).reduce((total, budget) => total + Number(budget), 0);

  return (
    <Dialog open={openBudgetDialog} onClose={toggleBudgetDialog} maxWidth="md" fullWidth>
      <DialogTitle>Manage Category Budgets</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
          Set monthly budget limits for each spending category.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Total Monthly Budget: ${totalBudget.toFixed(2)}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        
        <Grid container spacing={2}>
          {categories
            .filter(cat => cat.id !== 'income') // Exclude income category
            .map(category => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ mr: 1 }}>{category.icon}</Typography>
                  <Typography variant="body1">{category.name}</Typography>
                </Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={budgets[category.id] || 0}
                  onChange={(e) => handleUpdateBudgets(category.id, e.target.value)}
                />
              </Grid>
            ))
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleBudgetDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetDialog; 