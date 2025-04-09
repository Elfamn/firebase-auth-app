import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Task } from '../../types/task';
import TaskDetailModal from './TaskDetailModal';
import EditTaskModal from './EditTaskModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface TaskCardProps {
  task: Task;
  isDragDisabled?: boolean;
  onEditTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
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

const TaskCard = ({ 
  task, 
  isDragDisabled = false,
  onEditTask,
  onDeleteTask
}: TaskCardProps) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    setEditModalOpen(true);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };
  
  const handleEditTask = async (updates: Partial<Task>) => {
    if (onEditTask) {
      await onEditTask(task.id, updates);
    }
    setEditModalOpen(false);
  };
  
  const handleDeleteTask = async () => {
    if (onDeleteTask) {
      await onDeleteTask(task.id);
    }
    setDeleteConfirmOpen(false);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailModalOpen(true);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%',
          '&:hover': {
            boxShadow: 3
          },
        }}
        data-task-id={task.id}
        data-status={task.status}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '70%' }}>
              {task.title}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton 
                size="small" 
                onClick={handleInfoClick}
                sx={{ pointerEvents: 'auto' }}
              >
                <InfoIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                aria-label="more options"
                aria-controls={open ? 'task-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ pointerEvents: 'auto' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="task-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                sx={{ zIndex: 10000 }}
              >
                <MenuItem onClick={handleEditClick}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Chip 
              label={task.status} 
              size="small" 
              color={getStatusColor(task.status)}
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {task.timeEstimate.hours}h {task.timeEstimate.minutes}m
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <TaskDetailModal
        task={task}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
      
      {onEditTask && (
        <EditTaskModal
          task={task}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditTask}
        />
      )}
      
      {onDeleteTask && (
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDeleteTask}
          title="Delete Task"
          message={`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`}
        />
      )}
    </>
  );
};

export default TaskCard;