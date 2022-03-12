import {
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

import type { User } from "firebase/auth";

import { writable } from "svelte/store";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const authStore = writable({
  displayName: "",
  haveUser: false,
  user: null as User | null,
});

function afterAuth(user: User | null) {
  authStore.update((val) => (val = { ...val, user: (val.user = user) }));
  authStore.update((val) => ({ ...val, haveUser: true }));
  authStore.update((val) => ({ ...val, displayName: user.displayName }));
}

export async function signInWithGoogle(cb = null) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    afterAuth(user);

    if (cb) {
      cb();
    }
  } catch (err) {
    alert(err.message);
  }
}

export async function signInWithGithub(cb = null) {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    afterAuth(user);

    if (cb) {
      cb();
    }
  } catch (err) {
    alert(err.message);
  }
}

export async function signOutFunction(cb = null) {
  try {
    await signOut(auth);

    authStore.update((val) => ({
      ...val,
      haveUser: false,
      user: null,
      displayName: "",
    }));

    if (cb) {
      cb();
    }
  } catch (err) {
    alert(err.message);
  }
}

export function getCurrentUser(cb = null) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      afterAuth(user);

      if (cb) {
        cb();
      }
    }
  });
}
