import { writable } from "svelte/store";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { authStore } from "./auth";
import type { User } from "firebase/auth";

let user = null as User | null;

authStore.subscribe((val) => {
  user = val.user;
});

export const streakStore = writable({
  practices: [],
  trophies: [],
  currentDayStreak: 0,
  averagePracticingTimes: 0,
  yourFavoriteBreathingExercice: 0,
  userGoal: 0,
});

let streakOpts = {} as any;

streakStore.subscribe((val) => {
  streakOpts = val;
});

export async function setPractice(practice: {
  exercice: string;
  repetitions: number;
}) {
  const streakRef = doc(db, "streaks", user.uid);
  await setDoc(
    streakRef,
    {
      practices: arrayUnion({ ...practice, practiced_at: new Date() }),
      uid: user.uid,
    },
    { merge: true }
  );
  streakStore.update((val) => ({
    ...val,
    practices: [...val.practices, practice],
  }));
}

export async function getUserStreak() {
  const streakRef = doc(db, "streaks", user.uid);
  const result = await getDoc(streakRef);
  const data = result.data();

  streakStore.update((val) => ({
    ...val,
    practices: data.practices,
  }));
}
