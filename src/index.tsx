import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from 'Store/store';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_HOST_BACK as string;
axios.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  console.log(`Error code:${error.response.status}`);
  return undefined;
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
