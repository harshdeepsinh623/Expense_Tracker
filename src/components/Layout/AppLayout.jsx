import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip, 
  Badge, 
  TextField, 
  InputAdornment,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '@mui/material/styles';

const AppLayout = ({ children }) => {
  const { 
    darkMode, 
    toggleDarkMode, 
    searchTerm, 
    setSearchTerm,
    toggleTaskDialog,
    userProfile,
    handleLogout
  } = useAppContext();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleNavigateToProfile = useCallback(() => {
    handleProfileMenuClose();
    navigate('/profile');
  }, [navigate, handleProfileMenuClose]);
  
  const handleUserLogout = useCallback(() => {
    handleProfileMenuClose();
    handleLogout();
    navigate('/login');
  }, [navigate, handleLogout, handleProfileMenuClose]);
  
  const handleNavigateToSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);
  
  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prevState => !prevState);
  }, []);
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Transactions', icon: <AccountBalanceWalletIcon />, path: '/transactions' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' }
  ];
  
  const handleNavigation = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [navigate, isMobile]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      transition: 'background-color 0.3s ease'
    }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0} color="default" sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(20px)',
        backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0, 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            {!isMobile && "FinanceTracker"}
          </Typography>
          
          <Box sx={{ flexGrow: 1, mx: 2, display: { xs: 'none', sm: 'block' } }}>
            <TextField
              placeholder="Search expenses & tasks..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Add Task">
              <IconButton color="primary" onClick={toggleTaskDialog}>
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Dark Mode">
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={handleNavigateToSettings}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem'
                  }}
                  src={userProfile.avatar || ''}
                >
                  {userProfile.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            {/* Profile Menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNavigateToProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleUserLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Content Area with Drawer and Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          variant={isMobile ? "temporary" : "persistent"}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
              height: 'calc(100vh - 64px)',
              position: 'relative'
            },
          }}
        >
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {menuItems.map((item) => (
              <ListItem 
                component="div"
                key={item.text} 
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                  cursor: 'pointer'
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <ListItem 
            component="div"
            onClick={handleUserLogout}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              cursor: 'pointer'
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Drawer>
        
        {/* Main content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerOpen && !isMobile ? 240 : 0}px)` },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{ 
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              p: { xs: 0.5, sm: 1 }
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout; 