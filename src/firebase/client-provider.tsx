'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

let firebaseInstance: ReturnType<typeof initializeFirebase> | null = null;

function getFirebaseInstance() {
    if (typeof window !== 'undefined') {
        if (!firebaseInstance) {
            firebaseInstance = initializeFirebase();
        }
        return firebaseInstance;
    }
    return { app: null, auth: null, firestore: null };
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    const instances = getFirebaseInstance();
    return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
