import React from 'react';
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
  Grid
} from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

const TaskDialog = () => {
  const {
    openTaskDialog,
    toggleTaskDialog,
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    taskPriority,
    setTaskPriority,
    taskDueDate,
    setTaskDueDate,
    taskRelatedCategory,
    setTaskRelatedCategory,
    handleTaskSubmit,
    editingTask,
    categories,
    taskPriorities
  } = useAppContext();

  return (
    <Dialog open={openTaskDialog} onClose={toggleTaskDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <form id="task-form" onSubmit={handleTaskSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                variant="outlined"
                fullWidth
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  label="Priority"
                >
                  {taskPriorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: priority.color,
                            mr: 1
                          }} 
                        />
                        {priority.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                required
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Related Category (Optional)</InputLabel>
                <Select
                  value={taskRelatedCategory}
                  onChange={(e) => setTaskRelatedCategory(e.target.value)}
                  label="Related Category (Optional)"
                >
                  <MenuItem value="">None</MenuItem>
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleTaskDialog}>Cancel</Button>
        <Button 
          form="task-form"
          type="submit"
          color="primary" 
          variant="contained"
        >
          {editingTask ? 'Update' : 'Add'} Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog; 