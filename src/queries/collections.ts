import { useEffect, useState } from 'react';
import { ref, onValue, child, push, update, get } from 'firebase/database';
import { auth, database } from '../firebase';
import { GroceryLists } from '../types/groceries-list';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useCollections() {
  const [user] = useAuthState(auth);

  const uid = user?.uid;
  const [collections, setCollections] = useState([] as GroceryLists[]);
  useEffect(() => {
    if (uid) {
      // TODO is there a better way of doing this?
      const collectionsRef = ref(database, `users/${uid}/collections`);
      get(collectionsRef).then((snapshot) => {
        snapshot.forEach((child) => {
          const realRef = ref(database, `collections/${child.val()}`);
          onValue(realRef, (collectionSnap) => {
            const collectionData = collectionSnap.val() as GroceryLists;
            setCollections((existingCollections) =>
              existingCollections.concat([
                {
                  name: collectionData.name,
                  id: child.val(),
                  lists: [],
                },
              ]),
            );
          });
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

// TODO maybe check user exists?
// TODO maybe use the user type here?
export function shareCollectionWithUser(
  collectionId: string,
  username: string,
) {
  try {
    const usersRef = ref(database, `users`);
    get(usersRef).then((snapshot) => {
      snapshot.forEach((child) => {
        const userData = child.val();
        if (userData.profile.userName === username) {
          const userCollectionsRef = ref(
            database,
            `users/${child.key}/collections`,
          );
          push(userCollectionsRef, collectionId);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}
