import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, authFn } from '../firebase';
import groceriesPng from '../assets/groceries.png';

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
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-lg gap-2 p-2 m-2">
      <h1 className="header">Groceries</h1>
      <h2 className="subheader">
        This is a simple grocery list app, where you can create and share (as a
        household) grocery lists, made for ease of use. You can also create
        templates for things you buy regularly.
      </h2>
      <h3 className=""></h3>
      <h3>A simple preview: </h3>
      <img className="w-3/4 h-4/5" alt="screenshot" src={groceriesPng} />
      <button className="btn" onClick={authFn}>
        Login with Google
      </button>
    </div>
  );
}
