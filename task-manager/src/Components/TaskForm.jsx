import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../Context/TaskContext';
import ReusableInput from '../Components/Inputs/ReusableInput';
import { validateInputs } from './Inputs/helper';
import "../CSS/TaskForm.css"

const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useContext(TaskContext);

  const initialValues = {
    name: '',
    dueDate: '',
    priority: '',
    description: ''
  };
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({ name: false, dueDate: false, priority: false, description: false });
  const [errors, setErrors] = useState({ name: '', dueDate: '', priority: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setValues({
        name: editingTask.name,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        description: editingTask.description
      });
      setTouched({ name: true, dueDate: true, priority: true, description: true });
      setErrors({ name: '', dueDate: '', priority: '', description: '' });
      setSubmitted(false);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    if (touched[name]) {
      setErrors(validateInputs({ [name]: value }, errors));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validateInputs({ [name]: values[name] }, errors));
  };

  const isFormValid =
    values.name.trim().length >= 3 &&
    values.dueDate &&
    values.dueDate >= new Date().toISOString().split('T')[0] &&
    values.priority &&
    Object.values(errors).every(err => err === '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, dueDate: true, priority: true, description: true });
    const validationResult = validateInputs(values, errors);
    setErrors(validationResult);
    if (!isFormValid) return;

    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      name: values.name.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      description: values.description.trim()
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
      setSubmitted(true);
    }

    setValues(initialValues);
    setTouched({ name: false, dueDate: false, priority: false, description: false });
    setErrors({ name: '', dueDate: '', priority: '', description: '' });
  };

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

  const inputsConfig = [
    { type: 'text', name: 'name', label: 'Task Name', placeholder: 'Enter task name' },
    { type: 'date', name: 'dueDate', label: 'Due Date' },
    { type: 'select', name: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High'] },
    { type: 'textarea', name: 'description', label: 'Description (optional)', placeholder: 'Enter description (max 200 chars)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
      {inputsConfig.map(input => (
        <ReusableInput
          key={input.name}
          type={input.type}
          name={input.name}
          label={input.label}
          value={values[input.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors[input.name]}
          touched={touched[input.name]}
          placeholder={input.placeholder || ''}
          options={input.options || []}
        />
      ))}
      <button type="submit" disabled={!isFormValid}>
        {editingTask ? 'Save Changes' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;