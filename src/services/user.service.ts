import { db } from '../config/db.firebase';
import { collection, doc, getDoc, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { User } from '../models/user.model';

const usersCollectionRef = collection(db, 'users');

/**
 * Creates a new user in Firestore.
 * @param userData User data (email, passwordHash).
 * @returns The ID of the newly created user.
 */
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(usersCollectionRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error creating user: ", e);
    throw e;
  }
};

/**
 * Finds a user by their email address.
 * @param email The email to search for.
 * @returns The User object if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(usersCollectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as Omit<User, 'id'>;
      return { id: doc.id, ...data };
    }
    return null;
  } catch (e) {
    console.error("Error finding user by email: ", e);
    throw e;
  }
};

/**
 * Finds a user by their ID.
 * @param id The user ID to search for.
 * @returns The User object if found, otherwise null.
 */
export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const userDocRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data() as Omit<User, 'id'>;
      return { id: userSnapshot.id, ...data };
    }
    return null;
  } catch (e) {
    console.error("Error finding user by ID: ", e);
    throw e;
  }
};