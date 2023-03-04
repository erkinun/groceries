import { useEffect, useState } from 'react';
import { ref, onValue, update, push, remove } from 'firebase/database';
import { database } from '../firebase';

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

// TODO define the profile type and use it
export function useProfile(uid: string) {
  const [profile, setProfile] = useState({} as Profile);
  useEffect(() => {
    if (uid) {
      const routinesRef = ref(database, `users/${uid}/profile`);
      onValue(routinesRef, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setProfile(data);
        }
      });
    }
  }, [uid]);

  return profile;
}
