'use client';
import { doc, setDoc, Firestore, collection, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from './errors';

export function setServiceRequest(db: Firestore, userId: string, data: any) {
  const docRef = doc(collection(db, 'serviceRequests'));
  const requestData = {
    ...data,
    userId,
    submittedAt: new Date().toISOString(), // Using ISO string for consistency
    updatedAt: new Date().toISOString(),
    status: 'Pending',
    id: docRef.id,
  };

  // Using serverTimestamp causes issues with client-side rendering before data is synced
  // so we use a client-side timestamp for now.
  const firestoreData = { ...requestData };
  delete (firestoreData as any).submittedAt;
  delete (firestoreData as any).updatedAt;
  firestoreData.submittedAt = serverTimestamp();
  firestoreData.updatedAt = serverTimestamp();


  setDoc(docRef, firestoreData)
    .catch(async (serverError) => {
      console.error("Firestore error:", serverError);
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: requestData,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError; // Re-throw to be caught by the form
    });

    return requestData; // return the client-side version of the data immediately
}
