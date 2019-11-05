import { auth } from './setup';

export function watchUserChanges(callback) {
  const unsub = auth.onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
      const {
        uid,
        email,
        displayName,
      } = user;

      callback({
        id: uid,
        email,
        displayName,
      });
    } else {
      callback(null);
    }
  });

  return unsub;
}

export function logOut() {
  auth.signOut();
}