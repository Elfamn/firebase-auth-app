import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Board from '../components/tasks/Board';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { Task, TaskFormData } from '../types/task';
import { useAuth } from '../context/AuthContext';
import { getUserTasks, updateTask, addTask, deleteTask } from '../services/taskService';
import AuthGuard from '../components/layout/AuthGuard';
import Notification from '../hooks/ui/Notification';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;

      try {
        const fetchedTasks = await getUserTasks(currentUser.uid);
        setTasks(fetchedTasks);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        showNotification('Failed to load tasks. Please try again later.', 'error');
      }
    };

    fetchTasks();
  }, [currentUser]);

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ message, severity });
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    if (!currentUser) return;

    try {
      await updateTask(currentUser.uid, taskId, { status: newStatus });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      showNotification('Task status updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating task status:', error);
      showNotification('Failed to update task status. Please try again.', 'error');
    }
  };

  const handleEditTask = async (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;

    try {
      await updateTask(currentUser.uid, taskId, updates);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      showNotification('Task updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating task:', error);
      showNotification('Failed to update task. Please try again.', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;

    try {
      await deleteTask(currentUser.uid, taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      showNotification('Task deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      showNotification('Failed to delete task. Please try again.', 'error');
    }
  };

  const handleAddTask = async (taskData: TaskFormData) => {
    if (!currentUser) return;
    
    try {
      const newTask = await addTask(currentUser.uid, {
        ...taskData,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setTasks(prev => [...prev, newTask]);
      setIsAddModalOpen(false);
      showNotification('Task added successfully', 'success');
    } catch (error) {
      console.error('Error adding task:', error);
      showNotification('Failed to add task. Please try again.', 'error');
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Task
          </Button>
        </Box>

        <Board 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <AddTaskModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={handleAddTask}
        />

        {notification && (
          <Notification
            open={!!notification}
            message={notification.message}
            severity={notification.severity}
            onClose={() => setNotification(null)}
          />
        )}
      </Box>
    </AuthGuard>
  );
}