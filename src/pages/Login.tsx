import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, authFn } from '../firebase';

export function Login() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    console.log({ user, loading });
    if (loading) {
      // TODO maybe trigger a loading screen
      return;
    }
    if (user) navigate('/dashboard');
  }, [user, loading]);

  return (
    <div>
      <h1>Hello Groceries</h1>
      <button className="login__btn login__google" onClick={authFn}>
        Login with Google
      </button>
    </div>
  );
}
