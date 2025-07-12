import { collection, addDoc, doc, serverTimestamp, getDoc, getDocs, query, where, updateDoc, deleteDoc, DocumentData, QueryDocumentSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/db.firebase';
import { Task } from '../models/task.model';

const tasksCollectionRef = collection(db, 'tasks');
/**
 * Creates a new task with an auto-generated Firestore ID.
 * @param taskData The task data to create (without id or createdAt).
 * @returns The ID of the newly created task.
 */
export const createNewTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(tasksCollectionRef, {
      ...taskData,
      createdAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Retrieves a single task by its Firestore document ID.
 * @param id The ID of the task to retrieve.
 * @returns The Task object, or null if not found.
 */
export const getTaskById = async (id: string, userId: string): Promise<Task | null> => {
  try {
    const taskDocRef = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDocRef);

    if (taskSnapshot.exists()) {
      const data = taskSnapshot.data() as Omit<Task, 'id'>;

      if (data.userId !== userId) {
        console.warn(`Attempted to access task ${id} by wrong user ${userId}`);
        return null;
      }

      if (data.createdAt instanceof Date === false && data.createdAt && typeof (data.createdAt as any).toDate === 'function') {
        data.createdAt = (data.createdAt as any).toDate();
      }
      
      return { id: taskSnapshot.id, ...data };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

/**
 * Retrieves all tasks from the 'tasks' collection.
 * @returns An array of Task objects.
 */
export const getAllTasksForUser = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(tasksCollectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as Omit<Task, 'id'>;
      if (data.createdAt instanceof Date === false && data.createdAt && typeof (data.createdAt as any).toDate === 'function') {
        data.createdAt = (data.createdAt as any).toDate();
      }
      
      tasks.push({ id: doc.id, ...data });
    });
    return tasks;
  } catch (e) {
    console.error("Error getting all documents for user: ", e);
    throw e;
  }
};

/**
 * Retrieves tasks filtered by their completion status.
 * @param completed The completion status (true for completed, false for incomplete).
 * @returns An array of Task objects matching the status.
 */
export const getTasksByCompletionStatusForUser = async (completed: boolean, userId: string): Promise<Task[]> => {
  try {
    const q = query(tasksCollectionRef, where("userId", "==", userId), where("completed", "==", completed), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as Omit<Task, 'id'>;
      if (data.createdAt instanceof Date === false && data.createdAt && typeof (data.createdAt as any).toDate === 'function') {
        data.createdAt = (data.createdAt as any).toDate();
      }
      
      tasks.push({ id: doc.id, ...data });
    });
    return tasks;
  } catch (e) {
    console.error("Error getting filtered documents for user: ", e);
    throw e;
  }
};

/**
 * Updates specific fields of an existing task document.
 * @param id The ID of the task to update.
 * @param updates An object containing the fields to update.
 */
export const updateTaskFields = async (id: string, userId: string, updates: Partial<Task>): Promise<boolean> => {
  try {
    const taskDocRef = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDocRef);

    if (!taskSnapshot.exists() || (taskSnapshot.data() as Task).userId !== userId) {
      return false;
    }

    const formattedUpdates: { [key: string]: any } = { ...updates };
    if (formattedUpdates.dueDate instanceof Date) {
      formattedUpdates.dueDate = serverTimestamp();
    }

    delete formattedUpdates.userId;
    delete formattedUpdates.createdAt;

    await updateDoc(taskDocRef, formattedUpdates);
    console.log("Document successfully updated!");
    return true;
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

/**
 * Deletes a task document by its ID.
 * @param id The ID of the task to delete.
 */
export const deleteTask = async (id: string, userId: string): Promise<boolean> => {
  try {
    const taskDocRef = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDocRef);

    if (!taskSnapshot.exists() || (taskSnapshot.data() as Task).userId !== userId) {
      return false;
    }

    await deleteDoc(taskDocRef);
    console.log("Document successfully deleted!");
    return true;
  } catch (e) {
    console.error("Error removing document: ", e);
    throw e;
  }
};