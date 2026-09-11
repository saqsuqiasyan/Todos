import React from 'react';
import { useTodoContext } from '../../context/TodoContext';
import styles from './TodoFilter.module.css';

const FILTERS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'done', label: 'Completed' },
  { value: 'notDone', label: 'Pending' }
];

function TodoFilter() {
  const { filter, setFilter } = useTodoContext();

  return (
    <div className={styles.container} role="group" aria-label="Filter todos">
      <h3 className={styles.title}>Filter</h3>
      <div className={styles.buttons}>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.button} ${filter === value ? styles.active : ''}`}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TodoFilter;
