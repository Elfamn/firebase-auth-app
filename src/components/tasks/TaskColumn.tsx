import React from 'react';
import { Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '../../types/task';
import SortableTaskCard from './SortableTaskCard';

interface TaskColumnProps {
  id: string;
  tasks: Task[];
  onEditTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ id, tasks, onEditTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'column',
      accepts: ['task']
    }
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: '200px',
        height: '90%',
        ...(tasks.length === 0 && {
          border: '2px dashed #ccc',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        })
      }}
      data-column-id={id}
    >
      {tasks.map((task) => (
        <SortableTaskCard
          key={task.id}
          task={task}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </Box>
  );
};

export default TaskColumn;