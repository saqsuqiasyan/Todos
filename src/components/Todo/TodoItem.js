import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTodoContext } from '../../context/TodoContext';
import styles from './TodoItem.module.css';

function TodoItem({ todo }) {
  const { removeTodo, toggleTodo, startDrag, endDrag, dropOnPriority, dropTodoOnPriority } = useTodoContext();
  const itemRef = useRef(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartTime = useRef(0);

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

  // Touch handlers for mobile drag and drop
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e) => {
    if (!touchStartTime.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
    const holdTime = Date.now() - touchStartTime.current;
    
    // Start dragging after holding for 150ms and moving at least 5px
    if (holdTime > 150 && (deltaX > 5 || deltaY > 5)) {
      if (!isTouchDragging) {
        setIsTouchDragging(true);
        startDrag(todo);
        if (itemRef.current) {
          itemRef.current.style.opacity = '0.7';
          itemRef.current.style.transform = 'scale(1.02)';
          itemRef.current.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        }
      }
      
      // Highlight drop targets
      const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
      document.querySelectorAll('[data-priority]').forEach(el => {
        el.classList.remove('touch-drag-over');
      });
      
      for (const el of elementsAtPoint) {
        const section = el.closest('[data-priority]');
        if (section && parseInt(section.dataset.priority) !== todo.priority) {
          section.classList.add('touch-drag-over');
          break;
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isTouchDragging) {
      // Reset styles
      if (itemRef.current) {
        itemRef.current.style.opacity = '';
        itemRef.current.style.transform = '';
        itemRef.current.style.boxShadow = '';
      }
      
      // Remove all highlights
      document.querySelectorAll('[data-priority]').forEach(el => {
        el.classList.remove('touch-drag-over');
      });

      // Find drop target
      const touch = e.changedTouches[0];
      const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
      
      for (const el of elementsAtPoint) {
        const section = el.closest('[data-priority]');
        if (section) {
          const targetPriority = parseInt(section.dataset.priority, 10);
          if (targetPriority && targetPriority !== todo.priority) {
            dropTodoOnPriority(todo.id, targetPriority);
            break;
          }
        }
      }
      
      endDrag();
      setIsTouchDragging(false);
    }
    
    touchStartTime.current = 0;
  };

  return (
    <li
      ref={itemRef}
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${isTouchDragging ? styles.dragging : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
