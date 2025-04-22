import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  useTheme
} from '@mui/material';

const StatsCard = ({ title, value, subtitle, icon, iconColor, trend }) => {
  const theme = useTheme();
  
  // Determine the trend color for text
  const getTrendColor = () => {
    switch(trend) {
      case 'up':
        return 'error.main'; // Bad for expenses going up
      case 'down':
        return 'success.main'; // Good for expenses going down
      case 'up_good':
        return 'success.main'; // Good for income going up
      case 'down_bad':
        return 'error.main'; // Bad for income going down
      default:
        return 'text.secondary';
    }
  };
  
  return (
    <Card 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {value}
            </Typography>
            <Typography variant="body2" color={getTrendColor()}>
              {subtitle}
            </Typography>
          </Box>
          
          <Avatar
            sx={{
              bgcolor: iconColor ? `${iconColor}15` : 'grey.100',
              color: iconColor || 'grey.500',
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 