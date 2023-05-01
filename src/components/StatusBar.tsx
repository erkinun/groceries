import { useAuthState } from 'react-firebase-hooks/auth';
import { useOnlineStatus } from '../hooks/online-status';
import { useProfile } from '../queries/user';
import { auth } from '../firebase';
import { useCollections } from '../queries/collections';
import { CollectionList } from './CollectionList';

// TODO we can use the user's profile picture here
// TODO add a logout menu item
export default function StatusBar() {
  const isOnline = useOnlineStatus();
  const collections = useCollections();
  const [user] = useAuthState(auth);
  const profile = useProfile();

  return (
    <div className="flex bg-primary text-white justify-between p-2">
      <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
      {
        // TODO add the onChange event
      }
      <CollectionList collections={collections} />
      <div>👋 {user?.displayName ?? profile.userName}!</div>
    </div>
  );
}
