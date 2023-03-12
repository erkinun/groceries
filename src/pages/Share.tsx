import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CollectionList } from '../components/CollectionList';

import { auth } from '../firebase';
import {
  shareCollectionWithUser,
  useCollections,
} from '../queries/collections';
import { updateUserName, useProfile } from '../queries/user';
import { GroceryLists } from '../types/groceries-list';

// TODO this component renders 7 times to get the full details
// TODO in near future, receipient of the share should be able approve or deny
export function Share() {
  // TODO can we just include the auth state in the hooks below?
  const [user] = useAuthState(auth);
  const profile = useProfile();
  const collections = useCollections();
  const [collectionId, setCollectionId] = useState<string>(collections[0]?.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleShare = async () => {
    console.log('sharing', collectionId, inputRef.current?.value);
    if (inputRef.current?.value && collectionId !== '') {
      // TODO maybe add some result state to confirm the share was successful
      shareCollectionWithUser(collectionId, inputRef.current?.value);
    }
  };

  useEffect(() => {
    if (Array.isArray(collections)) {
      setCollectionId(collections[0]?.id);
    }
  }, [collections]);

  return (
    <div>
      <div>Hi {profile.userName ?? user?.displayName}!</div>
      <div>
        <h2>Share your collection</h2>
        <CollectionList
          collections={collections}
          onChange={(collection) => setCollectionId(collection.id)}
        />
        <div>
          <label htmlFor="share">Share with</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter username of user"
          />
        </div>

        <button onClick={handleShare}>Share</button>
      </div>
    </div>
  );
}
