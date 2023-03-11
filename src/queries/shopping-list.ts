import { useEffect, useState } from 'react';
import { GroceryList } from '../types/groceries-list';
import { ref, onValue, child, push, update } from 'firebase/database';
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
        const lists = [] as GroceryList[];
        snapshot.forEach((child) => {
          const realRef = ref(database, `lists/${child.val()}`);
          onValue(realRef, (listSnap) => {
            const listData = listSnap.val() as GroceryList;
            lists.push({
              name: listData.name,
              id: child.val(),
              date: listData.date,
              items: listData.items,
            });
            setShoppingLists(lists);
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
