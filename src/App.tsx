import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NotFoundPage from './Pages/error';
import AboutPage from './Pages/about';
import Companies from './Pages/company/moduls/Companies';
import Users from './Pages/user/moduls/Users';
import { Provider } from 'react-redux';
import { store } from 'Store/store';
import { Auth0Provider } from '@auth0/auth0-react';

let domain = process.env.REACT_APP_DOMAIN as string;
let clientId = process.env.REACT_APP_CLIENT_ID as string;
function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin+'/users/profile',
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/users/*" element={<Users />} />
            <Route path="/companies/*" element={<Companies />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
            <Route path="/not-found" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  );
}

export default App;
