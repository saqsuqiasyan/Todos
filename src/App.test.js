import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

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

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('renders header with app title', () => {
    render(<App />);
    expect(screen.getByText('ToDos')).toBeInTheDocument();
  });

  test('renders Add Task form', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Add Task' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    render(<App />);
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('shows empty state when no todos', () => {
    render(<App />);
    expect(screen.getByText('No Todos Yet')).toBeInTheDocument();
  });

  test('adds a new todo', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const highPriorityRadio = screen.getByLabelText('High');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'New test todo' } });
    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    expect(screen.getByText('New test todo')).toBeInTheDocument();
    expect(screen.queryByText('No Todos Yet')).not.toBeInTheDocument();
  });

  test('shows error when adding todo without priority', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'New test todo' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Please select a priority')).toBeInTheDocument();
  });

  test('shows error when adding todo without title', () => {
    render(<App />);
    
    const highPriorityRadio = screen.getByLabelText('High');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter a task')).toBeInTheDocument();
  });

  test('toggles todo completion', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const highPriorityRadio = screen.getByLabelText('High');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'Toggle test todo' } });
    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('deletes a todo', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const highPriorityRadio = screen.getByLabelText('High');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'Delete test todo' } });
    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    expect(screen.getByText('Delete test todo')).toBeInTheDocument();

    const deleteButton = screen.getByTitle('Delete todo');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Delete test todo')).not.toBeInTheDocument();
  });

  test('filters todos by completion status', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const highPriorityRadio = screen.getByLabelText('High');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'First todo' } });
    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    fireEvent.change(input, { target: { value: 'Second todo' } });
    fireEvent.click(highPriorityRadio);
    fireEvent.click(submitButton);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    const completedFilter = screen.getByText('Completed');
    fireEvent.click(completedFilter);

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('Second todo')).not.toBeInTheDocument();

    const pendingFilter = screen.getByText('Pending');
    fireEvent.click(pendingFilter);

    expect(screen.queryByText('First todo')).not.toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });
});
