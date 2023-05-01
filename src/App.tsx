import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import StatusBar from './components/StatusBar';
import { Header } from './pages/Header';
import ErrorPage from './pages/ErrorPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Share } from './pages/Share';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { Collections } from './pages/Collections';

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
]);

export function App() {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && window.location.pathname !== '/') window.location.href = '/';
  }, [user, loading]);

  error && console.error(error);

  return (
    <div className="flex">
      <Header />
      <div className="w-screen bg-cream">
        <StatusBar />
        {loading && <div>Loading</div>}
        {!loading && <RouterProvider router={router} />}
      </div>
    </div>
  );
}
