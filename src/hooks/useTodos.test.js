import { renderHook, act } from '@testing-library/react-hooks';
import { useTodos } from './useTodos';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useTodos hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('initializes with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  test('adds a todo with correct properties', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test todo', 1);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0]).toMatchObject({
      title: 'Test todo',
      priority: 1,
      completed: false
    });
  });

  test('rejects adding todo without valid priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      const success = result.current.addTodo('Test todo', 5);
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('rejects adding todo with empty title', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      const success = result.current.addTodo('   ', 1);
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('removes a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test todo', 1);
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.removeTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('toggles todo completed status', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test todo', 1);
    });

    const todoId = result.current.todos[0].id;
    expect(result.current.todos[0].completed).toBe(false);

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  test('updates todo priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test todo', 1);
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.updateTodoPriority(todoId, 3);
    });

    expect(result.current.todos[0].priority).toBe(3);
  });

  test('filters todos by completion status', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Todo 1', 1);
      result.current.addTodo('Todo 2', 1);
    });

    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
    });

    act(() => {
      result.current.setFilter('done');
    });

    const filtered = result.current.getFilteredTodos();
    expect(filtered.priority1).toHaveLength(1);
    expect(filtered.priority1[0].completed).toBe(true);

    act(() => {
      result.current.setFilter('notDone');
    });

    const filteredNotDone = result.current.getFilteredTodos();
    expect(filteredNotDone.priority1).toHaveLength(1);
    expect(filteredNotDone.priority1[0].completed).toBe(false);
  });

  test('returns correct stats', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Todo 1', 1);
      result.current.addTodo('Todo 2', 2);
      result.current.addTodo('Todo 3', 3);
    });

    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
    });

    const stats = result.current.getTodoStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });

  test('groups todos by priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('High priority', 1);
      result.current.addTodo('Medium priority', 2);
      result.current.addTodo('Low priority', 3);
    });

    const grouped = result.current.getFilteredTodos();
    expect(grouped.priority1).toHaveLength(1);
    expect(grouped.priority2).toHaveLength(1);
    expect(grouped.priority3).toHaveLength(1);
    expect(grouped.priority1[0].title).toBe('High priority');
    expect(grouped.priority2[0].title).toBe('Medium priority');
    expect(grouped.priority3[0].title).toBe('Low priority');
  });
});
