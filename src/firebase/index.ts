
'use client';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { useAuth, useFirestore, useFirebaseApp } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';


let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  if (typeof window === 'undefined') {
    // This function should only be called on the client.
    // If you are getting this error, you are likely calling it from a server component.
    throw new Error('Firebase can only be initialized on the client.');
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  
  return { firebaseApp, firestore: firestore!, auth: auth! };
}


export {
  initializeFirebase,
  useAuth,
  useFirestore,
  useFirebaseApp,
  useUser,
  useCollection,
  useDoc,
};
