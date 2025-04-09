import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task } from '../types/task';

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const addTask = async (userId: string, task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
    });
    return { id: docRef.id, ...task };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (userId: string, taskId: string, updates: Partial<Task>): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTaskOrder = async (userId: string, taskId: string, newOrder: number): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, {
      order: newOrder,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating task order:', error);
    throw error;
  }
};

export const batchUpdateTasks = async (userId: string, updates: Array<{id: string, updates: Partial<Task>}>): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, updates }) => {
      const taskRef = doc(db, 'users', userId, 'tasks', id);
      batch.update(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error batch updating tasks:', error);
    throw error;
  }
};