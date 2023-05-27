import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useCollections } from '../queries/collections';
import { useTemplates } from '../queries/templates';
import { ShoppingTemplate } from '../components/ShoppingTemplate';

export function Templates() {
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

  const templates = useTemplates(user?.uid ?? '', collections[0]?.id ?? '');

  return (
    <div className="w-full bg-cream text-neutral-600 p-2">
      <>
        <ShoppingTemplate collectionId={selectedCollection} />

        <h2 className="font-bold p-4">Existing Templates</h2>
        <div className="mt-4 flex flex-col gap-4">
          {templates.map((list) => {
            return (
              <ShoppingTemplate
                key={list.id}
                collectionId={selectedCollection}
                template={list}
              />
            );
          })}
        </div>
      </>
    </div>
  );
}
