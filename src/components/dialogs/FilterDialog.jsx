import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppContext } from '../../contexts/AppContext';

const FilterDialog = () => {
  const {
    openFilterDialog,
    toggleFilterDialog,
    searchTerm,
    setSearchTerm,
    categories
  } = useAppContext();
  
  // These states would be moved to context in a full implementation
  const [categoryFilter, setCategoryFilter] = useState('');
  const [incomeOnly, setIncomeOnly] = useState(false);
  const [expensesOnly, setExpensesOnly] = useState(false);
  const [recurringOnly, setRecurringOnly] = useState(false);

  const handleApplyFilters = () => {
    // In a full implementation, this would update filter state in the context
    toggleFilterDialog();
  };

  return (
    <Dialog open={openFilterDialog} onClose={toggleFilterDialog} maxWidth="xs" fullWidth>
      <DialogTitle>Filter Transactions</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description, category, or tag"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ mr: 1 }}>{cat.icon}</Box>
                      {cat.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={incomeOnly}
                  onChange={(e) => {
                    setIncomeOnly(e.target.checked);
                    if (e.target.checked) setExpensesOnly(false);
                  }}
                />
              }
              label="Income Only"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={expensesOnly}
                  onChange={(e) => {
                    setExpensesOnly(e.target.checked);
                    if (e.target.checked) setIncomeOnly(false);
                  }}
                />
              }
              label="Expenses Only"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={recurringOnly}
                  onChange={(e) => setRecurringOnly(e.target.checked)}
                />
              }
              label="Recurring Only"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleFilterDialog}>Cancel</Button>
        <Button 
          onClick={handleApplyFilters} 
          color="primary" 
          variant="contained"
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog; 