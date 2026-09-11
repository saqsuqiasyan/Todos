import React from 'react';
import PropTypes from 'prop-types';
import { useTodoContext } from '../../context/TodoContext';
import styles from './TodoItem.module.css';

function TodoItem({ todo }) {
  const { removeTodo, toggleTodo, startDrag, endDrag, dropOnPriority } = useTodoContext();

  const handleDragStart = (e) => {
    startDrag(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    endDrag();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = () => {
    dropOnPriority(todo.priority);
  };

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleToggle();
    }
  };

  return (
    <li
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={`Todo: ${todo.title}, ${todo.completed ? 'completed' : 'not completed'}`}
    >
      <div className={styles.content}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          onKeyDown={handleKeyDown}
          className={styles.checkbox}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
        />
        <span className={`${styles.title} ${todo.completed ? styles.titleCompleted : ''}`}>
          {todo.title}
        </span>
      </div>
      <button
        className={styles.deleteButton}
        onClick={handleRemove}
        aria-label={`Delete "${todo.title}"`}
        title="Delete todo"
      >
        &times;
      </button>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf([1, 2, 3]).isRequired
  }).isRequired
};

export default TodoItem;
