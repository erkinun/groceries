import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ShoppingList } from '../components/ShoppingList';

import { auth } from '../firebase';
import { useCollections } from '../queries/collections';
import { useShoppingLists } from '../queries/shopping-list';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTemplates } from '../queries/templates';
import Modal from '../components/Modal';

dayjs.extend(customParseFormat);

// TODO dynamic theme switching
// TODO maybe have general settings like, hide completed items
// TODO add react query and error handling in case there's no internet
// TODO grey out the older lists, older than today
// TODO handle the collections, at least style them, does selecting a collection work?
// TODO eslint
export function Dashboard() {
  const [user] = useAuthState(auth);
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
  const templates = useTemplates(user?.uid ?? '', collections[0]?.id ?? '');

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

  const [isNewListOpen, setIsNewListOpen] = useState<boolean>(false);
  const buttonStyle = 'bg-sec-background text-primary-text p-2 rounded';
  return (
    <div className="w-full text-neutral-600 p-2">
      <>
        <button onClick={() => setIsNewListOpen(true)} className={buttonStyle}>
          New shopping
        </button>

        <Modal
          fullWidth={true}
          isOpen={isNewListOpen}
          onClose={() => setIsNewListOpen(false)}
        >
          <div className="min-w-full">
            <ShoppingList
              collectionId={selectedCollection}
              templates={templates}
              afterSaveFn={() => setIsNewListOpen(false)}
            />
          </div>
        </Modal>

        <div className="mt-4 flex flex-col gap-4">
          {orderedByDateLists.map((list) => {
            return (
              <ShoppingList
                key={list.id}
                collectionId={selectedCollection}
                groceryList={list}
                templates={templates}
              />
            );
          })}
        </div>
      </>
    </div>
  );
}
