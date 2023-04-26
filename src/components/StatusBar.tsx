import { useAuthState } from 'react-firebase-hooks/auth';
import { useOnlineStatus } from '../hooks/online-status';
import { useProfile } from '../queries/user';
import { auth } from '../firebase';

export default function StatusBar() {
  const isOnline = useOnlineStatus();
  const [user] = useAuthState(auth);
  const profile = useProfile();

  return (
    <div className="flex bg-primary text-white justify-between p-2">
      <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
      <div>👋 {user?.displayName ?? profile.userName}!</div>
    </div>
  );
}
