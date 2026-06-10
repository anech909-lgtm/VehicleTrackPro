'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | null
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const docRefRef = useRef(docRef);

  useEffect(() => {
    // Prevent re-running the effect if the docRef object itself is the same.
    if (docRefRef.current && docRef && docRefRef.current.path === docRef.path) {
      return;
    }
    docRefRef.current = docRef;

    if (!docRef) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id });
        } else {
          setData(null);
        }
        setIsLoading(false);
        setError(null);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, isLoading, error };
}
