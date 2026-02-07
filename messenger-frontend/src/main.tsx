import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './styles/global.css';

const rootElement = document.getElementById('root');
const storedTheme = localStorage.getItem('theme');

if (storedTheme === 'dark') {
  document.body.classList.add('theme-dark');
}

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
