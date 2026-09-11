import React from 'react';
import { TodoProvider } from './context/TodoContext';
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import { TodoList } from './components/Todo';
import TodoFilter from './components/TodoFilter';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="app">
        <Header />
        <main className="main">
          <aside className="sidebar sidebar-left">
            <AddTodo />
          </aside>
          <section className="content">
            <TodoList />
          </section>
          <aside className="sidebar sidebar-right">
            <TodoFilter />
          </aside>
        </main>
      </div>
    </TodoProvider>
  );
}

export default App;
