import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { auth, database } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// TODO maybe add it to do the users list
// TODO design the data structure
// TODO check to see if the user exists
export async function updateUserName(uid: string, userName: string) {
  try {
    const profileRef = ref(database, `users/${uid}/profile`);
    await update(profileRef, {
      userName,
    });
  } catch (error) {
    console.error(error);
  }
}

// TODO move this to where?
type Profile = {
  userName: string;
};

export function useProfile() {
  const [user] = useAuthState(auth);
  const uid = user?.uid;
  const [profile, setProfile] = useState({} as Profile);

  useEffect(() => {
    if (uid) {
      const profileRef = ref(database, `users/${uid}/profile`);
      onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setProfile(data);
        }
      });
    }
  }, [uid]);

  return profile;
}
