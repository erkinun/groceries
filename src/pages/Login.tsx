import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, authFn } from '../firebase';

export function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    // TODO check if this works, if not, use a different hook
    // TODO and put it to main.tsx
    // TODO and make the login duration longer
    if (loading) {
      return;
    }
    if (user) navigate('/dashboard');
  }, [user, loading]);

  return (
    <div>
      <h1 className="header">Hello Groceries</h1>
      <button className="btn" onClick={authFn}>
        Login with Google
      </button>
    </div>
  );
}
