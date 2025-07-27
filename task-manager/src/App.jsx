import React from 'react';
import { TaskProvider } from './Context/TaskProvider';
import TaskForm from './Components/TaskForm';
import TaskList from './Components/TaskList';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <h1>Task Management System</h1>
        <div className="app-content">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;