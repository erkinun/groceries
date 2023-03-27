import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CollectionList } from '../components/CollectionList';
import { ShoppingList } from '../components/ShoppingList';
import StatusBar from '../components/StatusBar';

import { auth } from '../firebase';
import { useCollections, createCollection } from '../queries/collections';
import { useShoppingLists } from '../queries/shopping-list';
import { useProfile } from '../queries/user';

export function Dashboard() {
  const [user] = useAuthState(auth);
  const profile = useProfile();
  const collections = useCollections();
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
      <StatusBar />
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <div>
        <h2>Your collections</h2>

        <CollectionList collections={collections} />

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
                key={list.id}
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
