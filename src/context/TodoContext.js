import React, { createContext, useContext } from 'react';
import { useTodos } from '../hooks/useTodos';
import PropTypes from 'prop-types';

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const todoState = useTodos();

  return (
    <TodoContext.Provider value={todoState}>
      {children}
    </TodoContext.Provider>
  );
}

TodoProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}

export default TodoContext;
