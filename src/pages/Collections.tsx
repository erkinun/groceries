import { useRef } from 'react';

import { useCollections, createCollection } from '../queries/collections';
import { GroceryLists } from '../types/groceries-list';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function Collection({ collection }: { collection: GroceryLists }) {
  return <div>{collection.name}</div>;
}

// TODO we might need to delete the collections
export function Collections() {
  const [user] = useAuthState(auth);
  const collections = useCollections();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateButton = () => {
    createCollection(user?.uid ?? '', inputRef.current?.value ?? '');
  };

  return (
    <div>
      <h2>Create a new shopping collection</h2>
      <input ref={inputRef} type="text" />
      <button onClick={handleCreateButton}>Create</button>

      <h2>Existing collections</h2>
      <div className="flex flex-col gap-4">
        {collections.map((collection) => {
          return <Collection key={collection.id} collection={collection} />;
        })}
      </div>
    </div>
  );
}
