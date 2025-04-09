import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { TaskFormData, TaskStatus } from '../../types/task';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAddTask: (taskData: TaskFormData) => void;
}

const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(2, 1fr)',
}));

const initialFormState: TaskFormData = {
  title: '',
  description: '',
  timeEstimate: {
    hours: 0,
    minutes: 0
  },
  status: 'To Do'
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onAddTask }) => {
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.timeEstimate.hours < 0) {
      newErrors.hours = 'Hours cannot be negative';
    }

    if (formData.timeEstimate.minutes < 0 || formData.timeEstimate.minutes > 59) {
      newErrors.minutes = 'Minutes must be between 0 and 59';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddTask(formData);
      setFormData(initialFormState);
      onClose();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'hours' || name === 'minutes') {
      setFormData({
        ...formData,
        timeEstimate: {
          ...formData.timeEstimate,
          [name]: Number(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<TaskStatus>) => {
    setFormData({
      ...formData,
      status: e.target.value as TaskStatus
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleTextChange}
            margin="normal"
            required
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleTextChange}
            margin="normal"
            multiline
            rows={4}
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Time Estimate
          </Typography>

          <GridContainer>
            <TextField
              fullWidth
              label="Hours"
              name="hours"
              type="number"
              value={formData.timeEstimate.hours}
              onChange={handleTextChange}
              InputProps={{ inputProps: { min: 0 } }}
              error={!!errors.hours}
              helperText={errors.hours}
            />

            <TextField
              fullWidth
              label="Minutes"
              name="minutes"
              type="number"
              value={formData.timeEstimate.minutes}
              onChange={handleTextChange}
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              error={!!errors.minutes}
              helperText={errors.minutes}
            />
          </GridContainer>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;