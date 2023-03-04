import { useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import { updateUserName, useProfile } from '../queries/user';

export function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const profile = useProfile(user?.uid ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSave = () => {
    updateUserName(user?.uid ?? '', inputRef.current?.value ?? '');
  };

  return (
    <div>
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <div>
        <h2>Set your user name</h2>
        <input
          ref={inputRef}
          type="text"
          defaultValue={user?.displayName ?? ''}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
