import { useEffect, useState } from 'react';
import { TemplateList } from '../types/groceries-list';

import {
  ref,
  onValue,
  child,
  get,
  push,
  update,
  remove,
} from 'firebase/database';
import { database } from '../firebase';

const TEMPLATES = 'templates';

export function useTemplates(uid: string, collectionId: string) {
  const [templates, setTemplates] = useState([] as TemplateList[]);

  useEffect(() => {
    if (uid && collectionId) {
      const shoppingListsRef = ref(
        database,
        `collections/${collectionId}/templates`,
      );
      onValue(shoppingListsRef, (snapshot) => {
        snapshot.forEach((child) => {
          const realRef = ref(database, `${TEMPLATES}/${child.val()}`);
          onValue(realRef, (listSnap) => {
            const listData = listSnap.val() as TemplateList;
            setTemplates((existingLists) => {
              if (listData === null) {
                return existingLists.filter((list) => list.id !== child.val());
              }
              return existingLists.find((list) => list.id === child.val())
                ? existingLists.map((list) =>
                    list.id === child.val()
                      ? {
                          name: listData.name,
                          id: child.val(),
                          date: listData.date,
                          items: listData.items,
                        }
                      : list,
                  )
                : existingLists.concat([
                    {
                      name: listData.name,
                      id: child.val(),
                      date: listData.date,
                      items: listData.items,
                    },
                  ]);
            });
          });
        });
      });
    }
  }, [uid, collectionId]);

  return templates;
}

export async function createShoppingTemplate(
  collectionId: string,
  templateList: TemplateList,
) {
  try {
    const templateKey = push(child(ref(database), TEMPLATES)).key;

    const templateListRef = ref(database, `${TEMPLATES}/${templateKey}`);
    await update(templateListRef, templateList);
    const collectionListsRef = ref(
      database,
      `collections/${collectionId}/${TEMPLATES}`,
    );
    await push(collectionListsRef, templateKey);
  } catch (error) {
    console.error(error);
  }
}

// TODO check user has access to the list
export async function updateTemplate(templateList: TemplateList) {
  try {
    const newTemplateKey = templateList.id ?? '';
    const templatesRef = ref(database, `${TEMPLATES}/${newTemplateKey}`);
    await update(templatesRef, templateList);
  } catch (error) {
    console.error(error);
  }
}

// TODO check user has access to the list
export async function deleteTemplate(collectionId: string, templateId: string) {
  try {
    const deletingKey = templateId ?? '';
    const collectionTemplateRef = ref(
      database,
      `collections/${collectionId}/${TEMPLATES}`,
    );
    get(collectionTemplateRef).then((snapshot) => {
      snapshot.forEach((child) => {
        if (child.val() === deletingKey) {
          remove(child.ref);
        }
      });
    });
    const templatesRef = ref(database, `${TEMPLATES}/${deletingKey}`);
    await remove(templatesRef);
  } catch (error) {
    console.error(error);
  }
}
