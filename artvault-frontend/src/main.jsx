import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Silence console output in production to keep logs clean
if (import.meta.env?.PROD) {
  const noop = () => {};
  // Preserve errors in production for visibility; silence others
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);