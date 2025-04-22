import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

const Notification = () => {
  const { snackbar, handleCloseSnackbar } = useAppContext();

  return (
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 