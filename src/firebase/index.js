import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

export const firebaseApp = initializeApp(firebaseConfig);

// used for the firestore refs
const db = getFirestore(firebaseApp);

// here we can export reusable database references
export const todosRef = collection(db, "todos");
