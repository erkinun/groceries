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

export function App() {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (loading) {
      // TODO maybe trigger a loading screen
      return;
    }
    console.log({ user });
    if (!user) window.location.href = '/';
  }, [user, loading]);

  return (
    <div className="flex">
      <Header />
      <div className="w-screen bg-cream">
        <StatusBar />
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
