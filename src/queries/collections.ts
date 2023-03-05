import { useEffect, useState } from 'react';
import { ref, onValue, child, push, update } from 'firebase/database';
import { database } from '../firebase';
import { GroceryLists } from '../types/groceries-list';

export function useCollections(uid: string) {
  // TODO use the grocery list later on
  const [collections, setCollections] = useState([] as GroceryLists[]);
  useEffect(() => {
    if (uid) {
      // TODO is there a better way of doing this?
      // TODO read the lists? maybe only read them when a collection is selected
      const collectionsRef = ref(database, `users/${uid}/collections`);
      onValue(collectionsRef, (snapshot) => {
        const ids: string[] = [];
        const collections = [] as GroceryLists[];
        snapshot.forEach((child) => {
          const realRef = ref(database, `collections/${child.val()}`);
          onValue(realRef, (collectionSnap) => {
            const collectionData = collectionSnap.val() as GroceryLists;
            collections.push({
              name: collectionData.name,
              id: child.val(),
              lists: [],
            });
            setCollections(collections);
          });
          console.log(child.key, child.val());
          ids.push(child.key ?? '');
        });
      });
    }
  }, [uid]);

  return collections;
}

export async function createCollection(uid: string, name: string) {
  try {
    const newCollectionKey = push(child(ref(database), 'collections')).key;
    const collectionData = {
      name,
      users: [uid],
      lists: [],
    };

    const collectionsRef = ref(database, `collections/${newCollectionKey}`);
    await update(collectionsRef, collectionData);
    const userCollectionsRef = ref(database, `users/${uid}/collections`);
    await push(userCollectionsRef, newCollectionKey);
  } catch (error) {
    console.error(error);
  }
}
