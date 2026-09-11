import { useState, useCallback, useEffect } from 'react';
import { generateId } from '../utils/generateId';

const STORAGE_KEY = 'todos';

function loadTodosFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load todos from storage:', error);
  }
  
  const legacyTodos = migrateLegacyData();
  if (legacyTodos.length > 0) {
    return legacyTodos;
  }
  
  return [];
}

function migrateLegacyData() {
  const todos = [];
  try {
    const todos1 = JSON.parse(localStorage.getItem('todos1') || '[]');
    const todos2 = JSON.parse(localStorage.getItem('todos2') || '[]');
    const todos3 = JSON.parse(localStorage.getItem('todos3') || '[]');
    
    todos1.forEach(todo => todos.push({ ...todo, priority: 1 }));
    todos2.forEach(todo => todos.push({ ...todo, priority: 2 }));
    todos3.forEach(todo => todos.push({ ...todo, priority: 3 }));
    
    if (todos.length > 0) {
      localStorage.removeItem('todos1');
      localStorage.removeItem('todos2');
      localStorage.removeItem('todos3');
    }
  } catch (error) {
    console.error('Failed to migrate legacy data:', error);
  }
  return todos;
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodosFromStorage);
  const [filter, setFilter] = useState('all');
  const [draggedTodo, setDraggedTodo] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((title, priority) => {
    if (!title.trim()) return false;
    if (![1, 2, 3].includes(priority)) return false;
    
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      priority,
      completed: false,
      createdAt: Date.now()
    };
    
    setTodos(prev => [...prev, newTodo]);
    return true;
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const updateTodoPriority = useCallback((id, newPriority) => {
    if (![1, 2, 3].includes(newPriority)) return;
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, priority: newPriority } : todo
    ));
  }, []);

  const updateTodoTitle = useCallback((id, newTitle) => {
    if (!newTitle.trim()) return;
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, title: newTitle.trim() } : todo
    ));
  }, []);

  const startDrag = useCallback((todo) => {
    setDraggedTodo(todo);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedTodo(null);
  }, []);

  const dropOnPriority = useCallback((targetPriority) => {
    if (draggedTodo && draggedTodo.priority !== targetPriority) {
      updateTodoPriority(draggedTodo.id, targetPriority);
    }
    setDraggedTodo(null);
  }, [draggedTodo, updateTodoPriority]);

  const getFilteredTodos = useCallback(() => {
    let filtered = todos;
    
    switch (filter) {
      case 'done':
        filtered = todos.filter(todo => todo.completed);
        break;
      case 'notDone':
        filtered = todos.filter(todo => !todo.completed);
        break;
      default:
        filtered = todos;
    }
    
    return {
      priority1: filtered.filter(todo => todo.priority === 1),
      priority2: filtered.filter(todo => todo.priority === 2),
      priority3: filtered.filter(todo => todo.priority === 3)
    };
  }, [todos, filter]);

  const getTodoStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  return {
    todos,
    filter,
    setFilter,
    draggedTodo,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodoPriority,
    updateTodoTitle,
    startDrag,
    endDrag,
    dropOnPriority,
    getFilteredTodos,
    getTodoStats
  };
}
