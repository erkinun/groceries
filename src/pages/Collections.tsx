import { useRef } from 'react';

import { useCollections, createCollection } from '../queries/collections';
import { GroceryLists } from '../types/groceries-list';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function Collection({ collection }: { collection: GroceryLists }) {
  return <div>{collection.name}</div>;
}

// TODO we might need to delete the collections
// TODO show which collection is shared with, so don't delete
export function Collections() {
  const [user] = useAuthState(auth);
  const collections = useCollections();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateButton = () => {
    if (inputRef.current?.value) {
      createCollection(user?.uid ?? '', inputRef.current?.value ?? '');
    }
  };

  return (
    <div className="w-full text-neutral-600 p-2">
      <div className="bg-contrast p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2>Existing collections</h2>
        <div className="flex flex-col gap-4">
          {collections.map((collection) => {
            return <Collection key={collection.id} collection={collection} />;
          })}
        </div>
        <div className="flex gap-2 items-center">
          <h2>Create a new shopping collection</h2>
          <input className="p-2 border rounded" ref={inputRef} type="text" />
          <button
            className="p-2 rounded bg-sec-background text-primary-text"
            onClick={handleCreateButton}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
