import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const filmesRef = ref(db, 'filmes');

// Add a new film
export const addFilm = async (filmData) => {
  try {
    await push(filmesRef, {
      ...filmData,
      criadoEm: Date.now(),
    });
  } catch (error) {
    console.error('Error adding film:', error);
    throw error;
  }
};

// Get films with real-time listener
export const listenToFilms = (callback) => {
  return onValue(
    filmesRef,
    (snapshot) => {
      const data = snapshot.val();
      const filmes = data
        ? Object.entries(data).map(([id, filme]) => ({ id, ...filme }))
        : [];
      callback(filmes);
    },
    (error) => {
      console.error('Error listening to films:', error);
    }
  );
};

// Delete a film
export const deleteFilm = async (filmId) => {
  try {
    await remove(ref(db, `filmes/${filmId}`));
  } catch (error) {
    console.error('Error deleting film:', error);
    throw error;
  }
};

// Update a film
export const updateFilm = async (filmId, updates) => {
  try {
    await update(ref(db, `filmes/${filmId}`), updates);
  } catch (error) {
    console.error('Error updating film:', error);
    throw error;
  }
};
