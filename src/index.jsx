import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Create a div element for the root if it doesn't exist
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

// Create root and render
const root = createRoot(rootElement);
root.render(
  <HashRouter>
    <AuthProvider> {/* Wrap the App inside AuthProvider */}
      <App />
    </AuthProvider>
  </HashRouter>
);
