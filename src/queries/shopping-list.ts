import { useEffect, useState } from 'react';
import { GroceryList } from '../types/groceries-list';
import { ref, onValue, child, push, update, get } from 'firebase/database';
import { database } from '../firebase';

export function useShoppingLists(uid: string, collectionId: string) {
  const [shoppingLists, setShoppingLists] = useState([] as GroceryList[]);

  useEffect(() => {
    if (uid && collectionId) {
      const shoppingListsRef = ref(
        database,
        `collections/${collectionId}/lists`,
      );
      onValue(shoppingListsRef, (snapshot) => {
        snapshot.forEach((child) => {
          const realRef = ref(database, `lists/${child.val()}`);
          onValue(realRef, (listSnap) => {
            const listData = listSnap.val() as GroceryList;
            setShoppingLists((existingLists) =>
              existingLists.concat([
                {
                  name: listData.name,
                  id: child.val(),
                  date: listData.date,
                  items: listData.items,
                },
              ]),
            );
          });
        });
      });
    }
  }, [uid, collectionId]);

  return shoppingLists;
}

// TODO unify the names
export async function createShoppingList(
  collectionId: string,
  shoppingList: GroceryList,
) {
  try {
    const newShoppingListKey = push(child(ref(database), 'lists')).key;

    const shoppingListsRef = ref(database, `lists/${newShoppingListKey}`);
    await update(shoppingListsRef, shoppingList);
    const collectionListsRef = ref(
      database,
      `collections/${collectionId}/lists`,
    );
    await push(collectionListsRef, newShoppingListKey);
  } catch (error) {
    console.error(error);
  }
}

// TODO check user has access to the list
export async function updateShoppingList(
  collectionId: string,
  shoppingList: GroceryList,
) {
  try {
    const newShoppingListKey = shoppingList.id ?? '';
    const shoppingListsRef = ref(database, `lists/${newShoppingListKey}`);
    await update(shoppingListsRef, shoppingList);
  } catch (error) {
    console.error(error);
  }
}
