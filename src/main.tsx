import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import { Header } from './pages/Header';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Share } from './pages/Share';

import './index.css';
import StatusBar from './components/StatusBar';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/share',
    element: <Share />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex">
      <Header />
      <div>
        <StatusBar />
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>,
);
