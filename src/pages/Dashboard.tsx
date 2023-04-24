import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CollectionList } from '../components/CollectionList';
import { ShoppingList } from '../components/ShoppingList';
import StatusBar from '../components/StatusBar';

import { auth } from '../firebase';
import { useCollections, createCollection } from '../queries/collections';
import { useShoppingLists } from '../queries/shopping-list';
import { useProfile } from '../queries/user';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// TODO check for login, else redirect to login page

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

  const orderedByDateLists = lists
    .sort((a, b) => {
      const aDate = dayjs(a.date, 'DD/MM/YYYY');
      const bDate = dayjs(b.date, 'DD/MM/YYYY');

      if (dayjs(bDate).isBefore(dayjs(aDate))) {
        return -1;
      } else if (dayjs(bDate).isAfter(dayjs(aDate))) {
        return 1;
      } else {
        return 0;
      }
    })
    .slice(0, 20); // last 20 lists, TODO add pagination

  return (
    <div className="w-full bg-gray-100">
      <StatusBar />
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <>
        <h2>Your collections</h2>

        <CollectionList collections={collections} />

        <h2>Create a new shopping collection</h2>
        <input ref={inputRef} type="text" />
        <button onClick={handleCreateButton}>Create</button>

        <ShoppingList collectionId={selectedCollection} />

        <div>{orderedByDateLists.length} shopping lists in this collection</div>
        <div className="flex flex-col gap-4">
          {orderedByDateLists.map((list) => {
            return (
              <ShoppingList
                key={list.id}
                collectionId={selectedCollection}
                groceryList={list}
              />
            );
          })}
        </div>
      </>
    </div>
  );
}
