import React, { useState } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import styles from './AddTodo.module.css';

const PRIORITIES = [
  { value: 1, label: 'High', color: '#ef5350' },
  { value: 2, label: 'Medium', color: '#ff9800' },
  { value: 3, label: 'Low', color: '#4caf50' }
];

function AddTodo() {
  const { addTodo } = useTodoContext();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a task');
      return;
    }

    if (!priority) {
      setError('Please select a priority');
      return;
    }

    const success = addTodo(title, priority);
    if (success) {
      setTitle('');
      setPriority(null);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    if (error) setError('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Add new todo">
      <h2 className={styles.title}>Add Task</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="todo-input" className={styles.label}>
          Task Description
        </label>
        <input
          id="todo-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="What needs to be done?"
          className={styles.input}
          aria-describedby={error ? 'error-message' : undefined}
        />
      </div>

      <div className={styles.priorityGroup}>
        <span className={styles.label}>Priority Level</span>
        <div className={styles.priorityOptions} role="radiogroup" aria-label="Priority selection">
          {PRIORITIES.map(({ value, label, color }) => (
            <label
              key={value}
              className={`${styles.priorityOption} ${priority === value ? styles.selected : ''}`}
              style={{ '--priority-color': color }}
            >
              <input
                type="radio"
                name="priority"
                value={value}
                checked={priority === value}
                onChange={() => handlePriorityChange(value)}
                className={styles.radioInput}
              />
              <span className={styles.priorityLabel}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p id="error-message" className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitButton}>
        Add Task
      </button>
    </form>
  );
}

export default AddTodo;
