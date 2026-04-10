import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

// Import newly structured CSS
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

// Remove legacy index.css if any
// import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);