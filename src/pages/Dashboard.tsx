import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ShoppingList } from '../components/ShoppingList';

import { auth } from '../firebase';
import { useCollections, createCollection } from '../queries/collections';
import { useShoppingLists } from '../queries/shopping-list';
import { useProfile } from '../queries/user';

export function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const profile = useProfile(user?.uid ?? '');
  const collections = useCollections(user?.uid ?? '');
  const [selectedCollection, setSelectedCollection] = useState<string>(
    collections[0]?.id ?? '',
  );
  useEffect(() => {
    if (collections.length > 0) {
      setSelectedCollection(collections[0].id);
    }
  }, [collections]);
  const lists = useShoppingLists(user?.uid ?? '', collections[0]?.id ?? '');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateButton = () => {
    createCollection(user?.uid ?? '', inputRef.current?.value ?? '');
  };

  return (
    <div>
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <div>
        <h2>Your collections</h2>

        {
          // TODO handle the selected collection
        }
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

        <ShoppingList collectionId={selectedCollection} />

        <div>{lists.length} shopping lists in this collection</div>
        {
          // TODO show the older 20 shopping lists
          lists.map((list) => {
            return (
              <ShoppingList
                collectionId={selectedCollection}
                groceryList={list}
              />
            );
          })
        }
      </div>
    </div>
  );
}
