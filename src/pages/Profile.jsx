import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Chip,
  Fade,
  Card,
  CardContent,
  Badge,
  Tooltip,
  LinearProgress,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from '../contexts/AppContext';

const Profile = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    expenses, 
    taskStats,
    toggleBudgetDialog,
    filteredExpenses
  } = useAppContext();
  
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userProfile });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [animation, setAnimation] = useState(false);

  // Trigger animation effect when component mounts
  useEffect(() => {
    setAnimation(true);
  }, []);

  // Enhanced user data with demo profile information
  const enhancedUserProfile = {
    ...userProfile,
    profession: formData.profession || 'Financial Analyst',
    location: formData.location || 'New York, USA',
    education: formData.education || 'MBA Finance',
    interests: formData.interests || ['Budgeting', 'Investing', 'Personal Finance'],
    socialLinks: {
      twitter: formData.twitter || '@financewizard',
      linkedin: formData.linkedin || 'linkedin.com/in/financepro'
    }
  };

  // Calculate stats
  const totalTransactions = expenses.length;
  const joinDate = new Date(userProfile.joinDate || new Date()).toLocaleDateString();
  const totalSpent = filteredExpenses
    .filter(expense => !expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  const totalSaved = filteredExpenses
    .filter(expense => expense.isIncome)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0) - totalSpent;
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setFormData({ ...userProfile });
    }
    setIsEditing(!isEditing);
    setErrors({});
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile(formData);
      setIsLoading(false);
      setIsEditing(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 800);
  };

  // Card style for consistent design
  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.12)'
    }
  };

  return (
    // Main container with scrollable content
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      px: { xs: 0, sm: 1 },
      py: 1,
      overflow: 'auto' // Changed from 'hidden' to 'auto'
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1,
          px: 1
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            backgroundImage: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}
        >
          My Profile Dashboard
        </Typography>
        {showSuccessMessage && (
          <Fade in={showSuccessMessage}>
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ 
                ml: 2,
                borderRadius: '8px',
                py: 0,
                '& .MuiAlert-message': { p: '2px 0' }
              }}
            >
              Profile updated successfully!
            </Alert>
          </Fade>
        )}
      </Box>
      
      {/* Content container - scrollable */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              backgroundImage: 'linear-gradient(to bottom, #ffffff, #f7f9fc)',
              borderTop: '4px solid #6366F1',
              p: 0,
              mb: 2,
              height: '100%',
              overflow: 'auto' // Enable scrolling for profile section
            }}
          >
            {/* Profile hero section with gradient background */}
            <Box 
              sx={{ 
                p: 3,
                pt: 4,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isEditing ? (
                    <IconButton 
                      sx={{ 
                        bgcolor: '#6366F1', 
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#4F46E5' } 
                      }}
                      size="small"
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              >
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100,
                    bgcolor: '#6366F1',
                    border: '4px solid white',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                  }}
                  src={userProfile.avatar}
                >
                  {!userProfile.avatar && userProfile.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              
              {!isEditing ? (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    {userProfile.fullName}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {userProfile.email}
                  </Typography>
                  <Chip 
                    icon={<WorkIcon />} 
                    label={enhancedUserProfile.profession} 
                    size="small"
                    sx={{ 
                      borderRadius: '6px', 
                      bgcolor: 'rgba(99, 102, 241, 0.1)', 
                      color: '#6366F1',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: '#6366F1' }
                    }} 
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {enhancedUserProfile.interests.map((interest, index) => (
                      <Chip 
                        key={index} 
                        label={interest} 
                        size="small" 
                        sx={{ 
                          borderRadius: '6px',
                          bgcolor: '#F5F7FA',
                          border: '1px solid #E0E7FF',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    sx={{ 
                      mt: 2,
                      bgcolor: '#6366F1',
                      borderRadius: '8px',
                      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#4F46E5' }
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '8px' }}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleFormChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleFormChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleFormChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Profession"
                    name="profession"
                    value={formData.profession || enhancedUserProfile.profession}
                    onChange={handleFormChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Location"
                    name="location"
                    value={formData.location || enhancedUserProfile.location}
                    onChange={handleFormChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      startIcon={<CancelIcon />} 
                      onClick={handleEditToggle}
                      variant="outlined"
                      sx={{ 
                        borderRadius: '8px',
                        borderColor: '#E0E7FF',
                        color: '#6B7280',
                        '&:hover': { borderColor: '#C7D2FE', bgcolor: '#F5F7FA' }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      startIcon={isLoading ? null : <SaveIcon />}
                      disabled={isLoading}
                      sx={{ 
                        bgcolor: '#6366F1',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                        '&:hover': { bgcolor: '#4F46E5' }
                      }}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                  {isLoading && <LinearProgress sx={{ mt: 2 }} />}
                </form>
              )}
            </Box>
            
            {!isEditing && (
              <Box sx={{ p: 0, flexGrow: 1, overflow: 'auto' }}>
                <List disablePadding sx={{ width: '100%' }}>
                  <ListItem sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccountBalanceWalletIcon sx={{ color: '#6366F1' }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">Account Type</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{userProfile.accountType || "Standard"}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CalendarTodayIcon sx={{ color: '#6366F1' }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">Member Since</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{joinDate}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PhoneIcon sx={{ color: '#6366F1' }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">Contact Number</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{userProfile.phone || "No phone number added"}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HomeIcon sx={{ color: '#6366F1' }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">Location</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{enhancedUserProfile.location}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ 
                    px: 3, 
                    py: 1.5, 
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SchoolIcon sx={{ color: '#6366F1' }} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">Education</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{enhancedUserProfile.education}</Typography>}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Account Activity */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Stats cards row */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 2,
              mb: 2
            }}
          >
            <Card sx={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 0 0 100%'
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 2 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 500, fontSize: '0.7rem' }}>
                  TRANSACTIONS
                </Typography>
                <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
                  {totalTransactions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                  Total Activity
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 0 0 100%'
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 2 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 500, fontSize: '0.7rem' }}>
                  SAVED
                </Typography>
                <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
                  ${totalSaved.toFixed(0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                  Net Savings
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 0 0 100%'
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 2 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 500, fontSize: '0.7rem' }}>
                  COMPLETED
                </Typography>
                <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
                  {taskStats.completed}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                  Tasks Done
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 0 0 100%'
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 2 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 500, fontSize: '0.7rem' }}>
                  PENDING
                </Typography>
                <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
                  {taskStats.pending}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                  Open Tasks
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          {/* Management cards */}
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {/* Financial Management */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  ...cardStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0,
                  height: '100%',
                  borderTop: '4px solid #10B981',
                  overflow: 'auto' // Enable scrolling for this card
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    <AccountBalanceWalletIcon 
                      sx={{ mr: 1, color: '#10B981', fontSize: '1.1rem' }} 
                    />
                    Financial Management
                  </Typography>
                </Box>
                
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Button
                    startIcon={<BarChartIcon />}
                    variant="contained"
                    onClick={toggleBudgetDialog}
                    sx={{ 
                      py: 1, 
                      mb: 1.5, 
                      borderRadius: '8px',
                      bgcolor: '#10B981',
                      textTransform: 'none',
                      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.2)',
                      '&:hover': { bgcolor: '#059669' }
                    }}
                  >
                    Manage Budget Settings
                  </Button>
                  
                  <Button
                    startIcon={<HistoryIcon />}
                    variant="outlined"
                    sx={{ 
                      py: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      color: '#10B981',
                      borderColor: '#10B981',
                      '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.05)' }
                    }}
                  >
                    View Financial History
                  </Button>
                  
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.8rem' }}>
                      Spending Insights
                    </Typography>
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontSize="0.75rem">Monthly Budget</Typography>
                        <Typography variant="body2" fontSize="0.75rem" fontWeight="600">75% used</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10B981'
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontSize="0.75rem">Savings Goal</Typography>
                        <Typography variant="body2" fontSize="0.75rem" fontWeight="600">45% achieved</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={45} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10B981'
                          }
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Security Section */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  ...cardStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0,
                  height: '100%',
                  borderTop: '4px solid #F59E0B',
                  overflow: 'auto' // Enable scrolling for this card
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    <SecurityIcon 
                      sx={{ mr: 1, color: '#F59E0B', fontSize: '1.1rem' }} 
                    />
                    Account Security
                  </Typography>
                </Box>
                
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Alert 
                    severity="info" 
                    variant="outlined"
                    icon={<LockIcon fontSize="inherit" />}
                    sx={{ 
                      mb: 2, 
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      py: 0.75,
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      color: '#92400E',
                      bgcolor: 'rgba(245, 158, 11, 0.05)',
                      '& .MuiAlert-icon': { color: '#F59E0B' }
                    }}
                  >
                    Regular password updates help protect your financial data.
                  </Alert>
                  
                  <Button
                    variant="contained"
                    startIcon={<LockIcon />}
                    sx={{ 
                      py: 1, 
                      borderRadius: '8px',py: 1, 
                      borderRadius: '8px',
                      mb: 1.5,
                      bgcolor: '#F59E0B',
                      textTransform: 'none',
                      boxShadow: '0 4px 8px rgba(245, 158, 11, 0.2)',
                      '&:hover': { bgcolor: '#D97706' }
                    }}
                  >
                    Change Password
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<VerifiedUserIcon />}
                    sx={{ 
                      py: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      color: '#F59E0B',
                      borderColor: '#F59E0B',
                      '&:hover': { borderColor: '#D97706', bgcolor: 'rgba(245, 158, 11, 0.05)' }
                    }}
                  >
                    Enable Two-Factor Auth
                  </Button>
                  
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ fontSize: '0.8rem' }}>
                      Security Status
                    </Typography>
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontSize="0.75rem">Password Strength</Typography>
                        <Typography variant="body2" fontSize="0.75rem" fontWeight="600">Strong</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#F59E0B'
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontSize="0.75rem">Account Security Level</Typography>
                        <Typography variant="body2" fontSize="0.75rem" fontWeight="600">Medium</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={60} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#F59E0B'
                          }
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Recent Activity Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              ...cardStyle,
              mt: 2,
              p: 0,
              borderTop: '4px solid #EC4899',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                <HistoryIcon 
                  sx={{ mr: 1, color: '#EC4899', fontSize: '1.1rem' }} 
                />
                Recent Account Activity
              </Typography>
            </Box>
            
            <List disablePadding sx={{ maxHeight: '240px', overflow: 'auto' }}>
              {[
                { 
                  type: 'Login', 
                  device: 'MacBook Pro', 
                  date: '2025-04-20', 
                  time: '10:25 AM',
                  icon: <LockIcon fontSize="small" sx={{ color: '#6366F1' }} />
                },
                { 
                  type: 'Budget Updated', 
                  device: 'iPhone 15', 
                  date: '2025-04-19', 
                  time: '3:40 PM',
                  icon: <BarChartIcon fontSize="small" sx={{ color: '#10B981' }} />
                },
                { 
                  type: 'Password Changed', 
                  device: 'MacBook Pro', 
                  date: '2025-04-15', 
                  time: '2:12 PM',
                  icon: <SecurityIcon fontSize="small" sx={{ color: '#F59E0B' }} />
                },
                { 
                  type: 'Profile Updated', 
                  device: 'Google Chrome', 
                  date: '2025-04-10', 
                  time: '9:33 AM',
                  icon: <PersonIcon fontSize="small" sx={{ color: '#EC4899' }} />
                },
                { 
                  type: 'Account Created', 
                  device: 'Google Chrome', 
                  date: '2025-03-28', 
                  time: '11:20 AM',
                  icon: <VerifiedUserIcon fontSize="small" sx={{ color: '#6366F1' }} />
                }
              ].map((activity, index) => (
                <ListItem 
                  key={index}
                  divider={index < 4}
                  sx={{ 
                    px: 3, 
                    py: 1.5,
                    '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.02)' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight="500">
                        {activity.type}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {activity.device} · {activity.date} at {activity.time}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box 
              sx={{ 
                p: 2, 
                borderTop: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button 
                size="small"
                endIcon={<HistoryIcon fontSize="small" />}
                sx={{ 
                  textTransform: 'none',
                  color: '#EC4899',
                  '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.05)' }
                }}
              >
                View Complete History
              </Button>
            </Box>
          </Paper>
          
          {/* Additional action buttons */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              mt: 2
            }}
          >
            <Button 
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                borderColor: '#E5E7EB',
                color: '#6B7280',
                '&:hover': { borderColor: '#D1D5DB', bgcolor: '#F9FAFB' }
              }}
            >
              Delete Account
            </Button>
            <Button 
              variant="contained"
              color="secondary"
              sx={{ 
                borderRadius: '8px',
                bgcolor: '#6366F1',
                '&:hover': { bgcolor: '#4F46E5' }
              }}
            >
              Download Data
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;