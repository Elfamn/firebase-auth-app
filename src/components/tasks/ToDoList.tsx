import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface ToDoListProps {
  tasks: Task[];
}

const ToDoList = ({ tasks }: ToDoListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const filteredTasks = statusFilter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === statusFilter);
  
  const handleFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Task List</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Filter</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} isDragDisabled={true} />
          ))
        ) : (
          <Typography variant="body1" sx={{ py: 2, textAlign: 'center' }}>
            No tasks found with the selected filter.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ToDoList;