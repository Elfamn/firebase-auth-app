import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../types/task';
import TaskColumn from './TaskColumn';

interface BoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => Promise<void>;
  onEditTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const Board: React.FC<BoardProps> = ({
  tasks: initialTasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoTasks = tasks.filter((task) => task.status === 'To Do');
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  const todoIds = todoTasks.map((task) => task.id);
  const inProgressIds = inProgressTasks.map((task) => task.id);
  const doneIds = doneTasks.map((task) => task.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // effects
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;
    
    let newStatus: Task['status'];
    let isColumnDrop = false;
    
    if (['To Do', 'In Progress', 'Done'].includes(overId)) {
      newStatus = overId as Task['status'];
      isColumnDrop = true;
    } else {
      const overTask = tasks.find(task => task.id === overId);
      if (!overTask) return;
      newStatus = overTask.status;
    }
    
    if (activeTask.status !== newStatus) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === activeId ? { ...task, status: newStatus } : task
        )
      );
      
      await onStatusChange(activeId, newStatus);
      return;
    }
    
    if (!isColumnDrop && activeId !== overId && activeTask.status === newStatus) {
      let statusTasks: Task[];
      switch (newStatus) {
        case 'To Do':
          statusTasks = todoTasks;
          break;
        case 'In Progress':
          statusTasks = inProgressTasks;
          break;
        case 'Done':
          statusTasks = doneTasks;
          break;
        default:
          return;
      }
      
      const activeIndex = statusTasks.findIndex(task => task.id === activeId);
      const overIndex = statusTasks.findIndex(task => task.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newStatusTasks = arrayMove(statusTasks, activeIndex, overIndex);
        setTasks(prevTasks => {
          const otherTasks = prevTasks.filter(task => task.status !== newStatus);
          return [...otherTasks, ...newStatusTasks];
        });
        
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          height: '100%',
        }}
      >
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2,
            height: '100%',
            minHeight: '300px',
            backgroundColor: '#f5f5f5'
          }}
          data-column-id="To Do"
        >
          <Typography variant="h6" gutterBottom>
            To Do
          </Typography>
          <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="To Do"
              tasks={todoTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </SortableContext>
        </Paper>

        <Paper 
          elevation={1} 
          sx={{ 
            p: 2,
            height: '100%',
            minHeight: '300px',
            backgroundColor: '#e3f2fd'
          }}
          data-column-id="In Progress"
        >
          <Typography variant="h6" gutterBottom>
            In Progress
          </Typography>
          <SortableContext items={inProgressIds} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="In Progress"
              tasks={inProgressTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </SortableContext>
        </Paper>

        <Paper 
          elevation={1} 
          sx={{ 
            p: 2,
            height: '100%',
            minHeight: '300px',
            backgroundColor: '#e8f5e9'
          }}
          data-column-id="Done"
        >
          <Typography variant="h6" gutterBottom>
            Done
          </Typography>
          <SortableContext items={doneIds} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="Done"
              tasks={doneTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </SortableContext>
        </Paper>
      </Box>
    </DndContext>
  );
};

export default Board;