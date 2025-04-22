import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestoreIcon from '@mui/icons-material/Restore';
import { useAppContext } from '../contexts/AppContext';
import { useState } from 'react';

const Tasks = () => {
  const { 
    filteredTasks,
    taskStats,
    getCategoryById,
    getTaskPriorityDetails,
    handleEditTask,
    handleDeleteTask,
    handleToggleTaskComplete,
    formatDate,
    isTaskOverdue,
    toggleTaskDialog
  } = useAppContext();
  
  const [taskTab, setTaskTab] = useState(0);

  const handleTaskTabChange = (event, newValue) => {
    setTaskTab(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">Tasks</Typography>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          color="primary" 
          onClick={toggleTaskDialog}
          size="small"
        >
          Add Task
        </Button>
      </Box>

      {/* Task Stats */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Total Tasks</Typography>
                <Typography variant="h3">{taskStats.total}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Completed</Typography>
                <Typography variant="h3" sx={{ color: 'success.main' }}>
                  {taskStats.completed}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Pending</Typography>
                <Typography variant="h3" sx={{ color: 'warning.main' }}>
                  {taskStats.pending}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" gutterBottom>Completion Rate</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={taskStats.completionRate} 
                      color="success"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2">{taskStats.completionRate.toFixed(0)}%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Task Lists */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs
          value={taskTab}
          onChange={handleTaskTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Pending Tasks" />
          <Tab label="Completed Tasks" />
        </Tabs>
        
        <Divider />
        
        <Box p={2} sx={{ flexGrow: 1, overflow: 'auto' }}>
          {taskTab === 0 ? (
            // Pending Tasks
            <>
              <List sx={{ pt: 0 }}>
                {filteredTasks.filter(task => !task.completed).length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No pending tasks" 
                      secondary="Great job! All tasks are completed."
                      primaryTypographyProps={{ color: 'textSecondary' }}
                    />
                  </ListItem>
                ) : (
                  filteredTasks
                    .filter(task => !task.completed)
                    .sort((a, b) => {
                      // Sort by priority, then by due date
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      }
                      return new Date(a.dueDate) - new Date(b.dueDate);
                    })
                    .map(task => {
                      const priorityData = getTaskPriorityDetails(task.priority);
                      const isOverdue = isTaskOverdue(task);
                      const categoryData = task.category ? getCategoryById(task.category) : null;
                      
                      return (
                        <ListItem 
                          key={task.id}
                          sx={{ 
                            mb: 1, 
                            bgcolor: isOverdue ? 'error.light' : 'background.default',
                            borderRadius: 1
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: isOverdue ? 'bold' : 'normal',
                                    mr: 1
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Chip 
                                  label={task.priority}
                                  size="small"
                                  sx={{ 
                                    bgcolor: priorityData.color,
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    height: 20
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  Due: {formatDate(task.dueDate)}
                                  {isOverdue && ' (Overdue)'}
                                </Typography>
                                {categoryData && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Typography sx={{ mr: 0.5 }}>{categoryData.icon}</Typography>
                                    <Typography variant="body2" component="span">
                                      {categoryData.name}
                                    </Typography>
                                  </Box>
                                )}
                                {task.description && (
                                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {task.description}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Mark as Completed">
                              <IconButton 
                                edge="end" 
                                aria-label="complete" 
                                onClick={() => handleToggleTaskComplete(task.id)}
                                color="success"
                                sx={{ mr: 0.5 }}
                                size="small"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                edge="end" 
                                aria-label="edit" 
                                onClick={() => handleEditTask(task)}
                                sx={{ mr: 0.5 }}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                edge="end" 
                                aria-label="delete" 
                                onClick={() => handleDeleteTask(task.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })
                )}
              </List>
            </>
          ) : (
            // Completed Tasks
            <>
              <List sx={{ pt: 0 }}>
                {filteredTasks.filter(task => task.completed).length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No completed tasks" 
                      secondary="Complete some tasks to see them here."
                      primaryTypographyProps={{ color: 'textSecondary' }}
                    />
                  </ListItem>
                ) : (
                  filteredTasks
                    .filter(task => task.completed)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(task => {
                      const priorityData = getTaskPriorityDetails(task.priority);
                      const categoryData = task.category ? getCategoryById(task.category) : null;
                      
                      return (
                        <ListItem 
                          key={task.id}
                          sx={{ 
                            mb: 1,
                            bgcolor: 'success.light',
                            borderRadius: 1,
                            opacity: 0.8
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    textDecoration: 'line-through',
                                    mr: 1
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Chip 
                                  label={task.priority}
                                  size="small"
                                  sx={{ 
                                    bgcolor: priorityData.color,
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    height: 20
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  Completed on: {formatDate(task.updatedAt)}
                                </Typography>
                                {categoryData && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Typography sx={{ mr: 0.5 }}>{categoryData.icon}</Typography>
                                    <Typography variant="body2" component="span">
                                      {categoryData.name}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Mark as Pending">
                              <IconButton 
                                edge="end" 
                                aria-label="restore" 
                                onClick={() => handleToggleTaskComplete(task.id)}
                                sx={{ mr: 0.5 }}
                                size="small"
                              >
                                <RestoreIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                edge="end" 
                                aria-label="delete" 
                                onClick={() => handleDeleteTask(task.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })
                )}
              </List>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Tasks; 