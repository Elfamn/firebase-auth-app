import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { Task, TaskStatus } from '../../types/task';

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(2, 1fr)',
}));

const GridItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const getStatusColor = (status: TaskStatus): 'default' | 'primary' | 'success' => {
  switch (status) {
    case 'To Do':
      return 'default';
    case 'In Progress':
      return 'primary';
    case 'Done':
      return 'success';
    default:
      return 'default';
  }
};

const formatDate = (dateValue: Date | string | null | undefined): string => {
  if (!dateValue) return 'Not available';
  
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" component="div">
          {task.title}
        </Typography>
        <Chip 
          label={task.status} 
          size="small" 
          color={getStatusColor(task.status)}
          sx={{ mt: 1 }}
        />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
            {task.description || "No description provided."}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <GridContainer>
          <GridItem>
            <Typography variant="subtitle2" color="text.secondary">
              Time Estimate
            </Typography>
            <Typography variant="body1">
              {task.timeEstimate?.hours || 0}h {task.timeEstimate?.minutes || 0}m
            </Typography>
          </GridItem>
          
          <GridItem>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1">
              {task.status}
            </Typography>
          </GridItem>
          
          <GridItem>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">
              {formatDate(task.createdAt)}
            </Typography>
          </GridItem>
          
          <GridItem>
            <Typography variant="subtitle2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2">
              {formatDate(task.updatedAt)}
            </Typography>
          </GridItem>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailModal;