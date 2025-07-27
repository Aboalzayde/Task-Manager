// TaskForm.jsx
import '../CSS/TaskForm.css';
import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../Context/TaskContext';

const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useContext(TaskContext);

  // Initial form values
  const initialValues = {
    name: '',
    dueDate: '',
    priority: '',
    description: ''
  };
  const [values, setValues] = useState(initialValues);

  // Track touched fields for validation
  const [touched, setTouched] = useState({
    name: false,
    dueDate: false,
    priority: false,
    description: false
  });

  // Error messages for each field
  const [errors, setErrors] = useState({
    name: '',
    dueDate: '',
    priority: '',
    description: ''
  });

  // Confirmation state
  const [submitted, setSubmitted] = useState(false);

  // Effect: if editingTask changes, populate form
  useEffect(() => {
    if (editingTask) {
      // Fill form with the task's data
      setValues({
        name: editingTask.name,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        description: editingTask.description
      });
      setTouched({
        name: true, dueDate: true, priority: true, description: true
      });
      setErrors({ name: '', dueDate: '', priority: '', description: '' });
      setSubmitted(false); // Ensure edit form shows instead of success message
    }
  }, [editingTask]);

  // Validation function
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // Task Name validation
    if ('name' in fieldValues) {
      temp.name = fieldValues.name.trim().length >= 3
        ? '' : 'Task Name must be at least 3 characters.';
    }
    // Due Date validation
    if ('dueDate' in fieldValues) {
      const today = new Date().toISOString().split('T')[0]; // e.g. "2025-07-25"
      temp.dueDate = fieldValues.dueDate
        ? (fieldValues.dueDate < today ? 'Due date cannot be in the past.' : '')
        : 'Due Date is required.';
    }
    // Priority validation
    if ('priority' in fieldValues) {
      temp.priority = fieldValues.priority ? '' : 'Priority is required.';
    }
    // Description validation
    if ('description' in fieldValues) {
      temp.description = fieldValues.description.length <= 200
        ? '' : 'Description cannot exceed 200 characters.';
    }
    setErrors(temp);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    // Live-validate this field if already touched
    if (touched[name]) {
      validate({ [name]: value });
    }
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate({ [name]: values[name] });
  };

  // Check form validity
  const isFormValid =
    values.name.trim().length >= 3 &&
    values.dueDate &&
    values.dueDate >= new Date().toISOString().split('T')[0] &&
    values.priority &&
    Object.values(errors).every(err => err === '');

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all as touched
    setTouched({ name: true, dueDate: true, priority: true, description: true });
    validate();

    if (!isFormValid) return;

    // Prepare task object
    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      name: values.name.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      description: values.description.trim()
    };

    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      // Add new task
      addTask(taskData);
      setSubmitted(true);
    }

    // Reset form
    setValues(initialValues);
    setTouched({ name: false, dueDate: false, priority: false, description: false });
    setErrors({ name: '', dueDate: '', priority: '', description: '' });
  };

  // After showing submitted message, hide it and reset state
  const handleReset = () => {
    setSubmitted(false);
    setEditingTask(null);
  };

  if (submitted && !editingTask) {
    return (
      <div className="form-container">
        <h3>Task Added Successfully!</h3>
        <button onClick={handleReset}>Add Another Task</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>

      {/* Task Name */}
      <div className="form-group">
        <label htmlFor="name">Task Name :</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter task name"
          autoComplete='off'
        />
        {errors.name && touched.name && (
          <div className="error">{errors.name}</div>
        )}
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label htmlFor="dueDate">Due Date :</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.dueDate && touched.dueDate && (
          <div className="error">{errors.dueDate}</div>
        )}
      </div>

      {/* Priority */}
      <div className="form-group">
        <label htmlFor="priority">Priority :</label>
        <select
          id="priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">-- Select Priority --</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && touched.priority && (
          <div className="error">{errors.priority}</div>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description (optional):</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter description (max 200 chars)"
        />
        {errors.description && touched.description && (
          <div className="error">{errors.description}</div>
        )}
      </div>

      {/* Submit button */}
      <button type="submit" disabled={!isFormValid}>
        {editingTask ? 'Save Changes' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
