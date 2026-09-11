import React from 'react';
import PrioritySection from './PrioritySection';
import { useTodoContext } from '../../context/TodoContext';
import styles from './TodoList.module.css';

function TodoList() {
  const { getFilteredTodos, getTodoStats } = useTodoContext();
  const { priority1, priority2, priority3 } = getFilteredTodos();
  const { total, completed, pending } = getTodoStats();

  if (total === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h2>No Todos Yet</h2>
        <p>Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <span className={styles.statItem}>
          <strong>{total}</strong> total
        </span>
        <span className={styles.statItem}>
          <strong>{completed}</strong> done
        </span>
        <span className={styles.statItem}>
          <strong>{pending}</strong> pending
        </span>
      </div>
      <p className={styles.dragHint}>💡 Hold and drag tasks to change priority</p>
      
      <div className={styles.sections}>
        <PrioritySection priority={1} todos={priority1} />
        <PrioritySection priority={2} todos={priority2} />
        <PrioritySection priority={3} todos={priority3} />
      </div>
    </div>
  );
}

export default TodoList;
