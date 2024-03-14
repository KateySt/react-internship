import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from 'Store/store';
import { Auth0Provider } from '@auth0/auth0-react';
import AppRoutes from 'Pages/router/AppRoutes';

const domain = process.env.REACT_APP_DOMAIN as string;
const clientId = process.env.REACT_APP_CLIENT_ID as string;

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: process.env.REACT_APP_AUDIENCE as string,
        redirect_uri: window.location.origin,
      }}>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </Auth0Provider>
  );
}

export default App;
