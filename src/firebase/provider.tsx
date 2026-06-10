
'use client';

import * as React from 'react';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';
import { initializeFirebase } from '.';

type FirebaseContextValue = {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} | null;

export const FirebaseContext = React.createContext<FirebaseContextValue>(null);

export function useFirebaseApp() {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

export function useFirestore() {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    return null;
  }
  return context.firestore;
}

export function useAuth() {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseContext, setFirebaseContext] = React.useState<FirebaseContextValue>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !firebaseContext) {
      const { firebaseApp, firestore, auth } = initializeFirebase();
      setFirebaseContext({ firebaseApp, firestore, auth });
    }
  }, [firebaseContext]);

  if (!firebaseContext) {
    return null; // or a loading spinner
  }

  return (
    <FirebaseContext.Provider value={firebaseContext}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}
