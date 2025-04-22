import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch, 
  Card, 
  CardContent, 
  Chip,
  Avatar,
  InputAdornment,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppContext } from '../contexts/AppContext';

const Transactions = () => {
  const { 
    // Form states
    description, setDescription,
    amount, setAmount,
    category, setCategory,
    date, setDate,
    note, setNote,
    isIncome, setIsIncome,
    tagInput, setTagInput,
    tags, setTags,
    recurring, setRecurring,
    editingExpense, setEditingExpense,
    
    // Data
    filteredExpenses,
    
    // Functions
    handleSubmit,
    resetForm,
    handleDelete,
    handleEdit,
    handleAddTag,
    handleRemoveTag,
    getCategoryById,
    formatDate,
    
    // Constants
    categories,
    
    // Dialog
    openFilterDialog,
    toggleFilterDialog,
  } = useAppContext();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">Transactions</Typography>
        <Box>
          <Button 
            startIcon={<FilterListIcon />} 
            variant="outlined"
            onClick={toggleFilterDialog}
            size="small"
            sx={{ ml: 1 }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Transaction Form */}
      <Box id="expense-form" sx={{ mb: 2 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {editingExpense ? 'Edit Transaction' : 'Add New Transaction'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  size="small"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" required size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1 }}>{cat.icon}</Typography>
                          {cat.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  required
                  size="small"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Note (Optional)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Add Tags (Optional)"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleAddTag} 
                    variant="contained" 
                    sx={{ ml: 1, height: 40 }}
                    size="small"
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleRemoveTag(tag)} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isIncome}
                        onChange={(e) => setIsIncome(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Is Income"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={recurring}
                        onChange={(e) => setRecurring(e.target.checked)}
                        color="secondary"
                        size="small"
                      />
                    }
                    label="Recurring"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      resetForm();
                      setEditingExpense(null);
                    }}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="small"
                  >
                    {editingExpense ? 'Update' : 'Save'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      {/* Transaction List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Transaction History
        </Typography>
        
        {filteredExpenses.length === 0 ? (
          <Alert severity="info">
            No transactions found for this month. Add one to get started!
          </Alert>
        ) : (
          filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((expense) => {
            const categoryData = getCategoryById(expense.category);
            return (
              <Card key={expense.id} sx={{ mb: 1.5, borderLeft: `5px solid ${categoryData.color}` }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: categoryData.color,
                            width: 36, 
                            height: 36,
                            mr: 1.5
                          }}
                        >
                          {categoryData.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">{expense.description}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {categoryData.name} • {formatDate(expense.date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3} md={4}>
                      <Box>
                        {expense.tags && expense.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {expense.tags.map(tag => (
                              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </Box>
                        )}
                        {expense.note && (
                          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            {expense.note.length > 50 ? `${expense.note.slice(0, 50)}...` : expense.note}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: expense.isIncome ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                            mr: 1
                          }}
                        >
                          {expense.isIncome ? '+' : '-'}${parseFloat(expense.amount).toFixed(2)}
                        </Typography>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(expense)}
                              sx={{ mr: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(expense.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Transactions; 