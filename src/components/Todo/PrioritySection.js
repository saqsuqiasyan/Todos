import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';
import { useTodoContext } from '../../context/TodoContext';
import styles from './PrioritySection.module.css';

const PRIORITY_LABELS = {
  1: 'High Priority',
  2: 'Medium Priority',
  3: 'Low Priority'
};

const PRIORITY_COLORS = {
  1: '#ef5350',
  2: '#ff9800',
  3: '#4caf50'
};

function PrioritySection({ priority, todos }) {
  const { dropOnPriority, draggedTodo } = useTodoContext();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = () => {
    dropOnPriority(priority);
  };

  const isDragTarget = draggedTodo && draggedTodo.priority !== priority;

  return (
    <section
      className={`${styles.section} ${isDragTarget ? styles.dropTarget : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-priority={priority}
      aria-labelledby={`priority-${priority}-heading`}
    >
      <h3
        id={`priority-${priority}-heading`}
        className={styles.heading}
        style={{ borderLeftColor: PRIORITY_COLORS[priority] }}
      >
        <span className={styles.priorityIndicator} style={{ backgroundColor: PRIORITY_COLORS[priority] }} />
        {PRIORITY_LABELS[priority]}
        <span className={styles.count}>({todos.length})</span>
      </h3>
      
      {todos.length > 0 ? (
        <ul className={styles.list}>
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>No tasks in this priority level</p>
      )}
    </section>
  );
}

PrioritySection.propTypes = {
  priority: PropTypes.oneOf([1, 2, 3]).isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf([1, 2, 3]).isRequired
  })).isRequired
};

export default PrioritySection;
