import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTodoContext } from '../../context/TodoContext';
import styles from './TodoItem.module.css';

function TodoItem({ todo }) {
  const { removeTodo, toggleTodo, startDrag, endDrag, dropOnPriority, dropTodoOnPriority, updateTodoTitle } = useTodoContext();
  const itemRef = useRef(null);
  const inputRef = useRef(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartTime = useRef(0);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    if (!isTouchDragging) {
      setEditText(todo.title);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.title) {
      updateTodoTitle(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleEditBlur = () => {
    handleSaveEdit();
  };

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

  if (isEditing) {
    return (
      <li className={`${styles.todoItem} ${styles.editing}`}>
        <div className={styles.editContainer}>
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditBlur}
            className={styles.editInput}
            aria-label="Edit todo text"
          />
          <div className={styles.editButtons}>
            <button
              className={styles.saveButton}
              onClick={handleSaveEdit}
              aria-label="Save changes"
              title="Save"
            >
              ✓
            </button>
            <button
              className={styles.cancelButton}
              onClick={handleCancelEdit}
              aria-label="Cancel editing"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={itemRef}
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${isTouchDragging ? styles.dragging : ''}`}
      draggable={!isEditing}
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
        <span 
          className={`${styles.title} ${todo.completed ? styles.titleCompleted : ''}`}
          onDoubleClick={handleStartEdit}
        >
          {todo.title}
        </span>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.editButton}
          onClick={handleStartEdit}
          aria-label={`Edit "${todo.title}"`}
          title="Edit todo"
        >
          ✎
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleRemove}
          aria-label={`Delete "${todo.title}"`}
          title="Delete todo"
        >
          ✕
        </button>
      </div>
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
