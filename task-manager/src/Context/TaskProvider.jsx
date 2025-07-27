// TaskProvider.jsx
import React, { useState } from 'react';
import { TaskContext } from '../Context/TaskContext';

// TaskProvider component 
export const TaskProvider = ({ children }) => { 
  const [tasks, setTasks] = useState([]); 
  const [editingTask, setEditingTask] = useState(null); 
 
  // Add a new task 
  const addTask = (task) => { 
    setTasks(prevTasks => [...prevTasks, task]); 
  }; 
 
  // Update an existing task 
  const updateTask = (taskId, updatedTask) => { 
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? updatedTask : task 
      ) 
    ); 
  }; 
 
  // Delete a task 
  const deleteTask = (taskId) => { 
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)); 
  }; 
 
  // Context value 
  const contextValue = { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    editingTask, 
    setEditingTask 
  }; 
 
  return ( 
    <TaskContext.Provider value={contextValue}> 
      {children} 
    </TaskContext.Provider> 
  ); 
};