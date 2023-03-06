import { useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ShoppingList } from '../components/ShoppingList';

import { auth } from '../firebase';
import { useCollections, createCollection } from '../queries/collections';
import { updateUserName, useProfile } from '../queries/user';

export function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const profile = useProfile(user?.uid ?? '');
  const collections = useCollections(user?.uid ?? '');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateButton = () => {
    createCollection(user?.uid ?? '', inputRef.current?.value ?? '');
  };

  return (
    <div>
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <div>
        <h2>Your collections</h2>

        <select>
          {collections.map((collection) => (
            <option key={collection.name} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>

        <h2>Create a new shopping collection</h2>
        <input ref={inputRef} type="text" />
        <button onClick={handleCreateButton}>Create</button>

        <ShoppingList />

        {
          // TODO show the older 20 shopping lists
        }
      </div>
    </div>
  );
}
