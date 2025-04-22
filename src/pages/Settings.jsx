import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  Divider, 
  FormControlLabel,
  Switch,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import PrintIcon from '@mui/icons-material/Print';
import BarChartIcon from '@mui/icons-material/BarChart';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CategoryIcon from '@mui/icons-material/Category';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppContext } from '../contexts/AppContext';

const Settings = () => {
  const { 
    darkMode,
    toggleDarkMode,
    categories,
    budgets,
    handleUpdateBudgets,
    handleExportData,
    handleImportData,
    toggleBudgetDialog,
    useINR,
    toggleCurrency
  } = useAppContext();

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1">Settings</Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>User Preferences</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {darkMode ? <DarkModeIcon sx={{ mr: 1 }} /> : <LightModeIcon sx={{ mr: 1 }} />}
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={useINR}
                  onChange={toggleCurrency}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {useINR ? <CurrencyRupeeIcon sx={{ mr: 1 }} /> : <AttachMoneyIcon sx={{ mr: 1 }} />}
                  {useINR ? "Indian Rupees (₹)" : "US Dollars ($)"}
                </Box>
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Data Management</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={handleExportData}
            >
              Export Data
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              component="label"
              startIcon={<UploadIcon />}
              variant="outlined"
            >
              Import Data
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportData}
              />
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              startIcon={<PrintIcon />}
              variant="outlined"
            >
              Print Report
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Budget Management</Typography>
            <Button 
              startIcon={<BarChartIcon />} 
              variant="contained"
              onClick={toggleBudgetDialog}
              color="primary"
              sx={{ mb: 2 }}
            >
              Manage Budgets
            </Button>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Quick budget adjustment:
            </Typography>
            <Grid container spacing={2}>
              {categories
                .filter(cat => cat.id !== 'income') // Exclude income category
                .slice(0, 6) // Show just a few categories to keep it clean
                .map(category => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CategoryIcon sx={{ mr: 1, color: category.color }} />
                      <Typography variant="body2">{category.name}</Typography>
                    </Box>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Monthly Budget"
                      value={budgets[category.id] || 0}
                      onChange={(e) => handleUpdateBudgets(category.id, e.target.value)}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 0.5 }}>{useINR ? '₹' : '$'}</Typography>,
                      }}
                    />
                  </Grid>
                ))
              }
              <Grid item xs={12}>
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={toggleBudgetDialog}
                  sx={{ mt: 1 }}
                >
                  View All Categories
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>About</Typography>
        <Typography variant="body2" paragraph>
          Finance Tracker v1.0.0
        </Typography>
        <Typography variant="body2" color="textSecondary">
          This is a finance and task management application built with React and Material-UI.
          It allows you to track your expenses, income, and tasks while providing analytics on your spending habits.
        </Typography>
        <List sx={{ mt: 2 }}>
          <ListItem>
            <ListItemText 
              primary="Developed by"
              secondary="Harshdeepsinh Gohil"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Technologies Used"
              secondary="React, Material-UI, Context API"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Last Updated"
              secondary={new Date().toLocaleDateString()}
            />
          </ListItem>
        </List>
      </Paper>
    </>
  );
};

export default Settings; 