import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { Task } from '../../types/task';

interface SortableTaskCardProps {
  task: Task;
  onEditTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ 
  task, 
  onEditTask, 
  onDeleteTask 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      status: task.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginBottom: '16px',
    touchAction: 'none' as const,
    position: 'relative' as const,
    zIndex: isDragging ? 9999 : 'auto' as number | 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-task-id={task.id}
      data-status={task.status}
    >
      <TaskCard 
        task={task} 
        isDragDisabled={true}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

export default SortableTaskCard;