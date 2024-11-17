import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import {
  Profile,
  updateProfile,
  updateUserName,
  useProfile,
} from '../queries/user';

// TODO add the option of fetching last n groceries
// TODO next time you add a new item, add tanstack form or hook form
export function ProfilePage() {
  const [user] = useAuthState(auth);
  const [current, setProfile] = useProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSave = () => {
    user?.uid && updateProfile(user?.uid ?? '', current);
  };

  return (
    <div className="w-full text-neutral-600 p-2">
      <div className="bg-contrast p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="w-28 text-right text-gray-500">Display name:</div>
          <span>{user?.displayName ?? 'Display name not found'}</span>
        </div>
        <div className="flex gap-2">
          <div className="w-28 text-right text-gray-500">User name:</div>
          <span>{current.userName}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <h2 className="text-gray-500">Change your user name</h2>
          <input
            className="p-2 border rounded"
            ref={inputRef}
            type="text"
            value={current.userName}
            onChange={(e) =>
              setProfile((cur) => ({ ...cur, userName: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <h2 className="text-gray-500"># of grocery lists on Dashboard</h2>
          <input
            className="p-2 border rounded"
            min={1}
            max={20}
            type="number"
            value={current.numberOfGroceries}
            onChange={(e) =>
              setProfile((cur) => ({
                ...cur,
                numberOfGroceries: Number(e.target.value),
              }))
            }
          />
          <button
            className="p-2 rounded bg-sec-background text-primary-text"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
