import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import StatusBar from './components/StatusBar';
import { Header } from './pages/Header';
import ErrorPage from './pages/ErrorPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Share } from './pages/Share';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { Collections } from './pages/Collections';
import { Templates } from './pages/Templates';
import { Logout } from './pages/Logout';
import { DEFAULT_THEME } from './themes';
import { applyTheme } from './themes/utils';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
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
          path: '/templates',
          element: <Templates />,
        },
        {
          path: '/collections',
          element: <Collections />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/share',
          element: <Share />,
        },
        {
          path: '/logout',
          element: <Logout />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true,
    },
  },
);

function Root() {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && window.location.pathname !== '/') window.location.href = '/';
  }, [user, loading]);

  error && console.error(error);

  const [theme, setTheme] = useState(DEFAULT_THEME);

  /**
   * Run the applyTheme function every time the theme state changes
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="flex">
      <Header
        onThemeChange={() =>
          theme === 'dark' ? setTheme('base') : setTheme('dark')
        }
        theme={theme}
      />
      <div className="w-screen bg-primary-background">
        <StatusBar />
        {loading && <div>Loading</div>}
        {!loading && <Outlet />}
      </div>
    </div>
  );
}

export function App() {
  return <RouterProvider router={router} />;
}
