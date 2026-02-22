'use client';
import { doc, setDoc, Firestore, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from './errors';
import type { ServiceRequest } from '@/lib/types';

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
  const firestoreData: any = { ...requestData };
  delete firestoreData.submittedAt;
  delete firestoreData.updatedAt;
  firestoreData.submittedAt = serverTimestamp();
  firestoreData.updatedAt = serverTimestamp();

  if (data.appointmentDate) {
    firestoreData.appointmentDate = data.appointmentDate;
  }


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

export function updateServiceRequestStatus(db: Firestore, requestId: string, status: ServiceRequest['status']) {
    const docRef = doc(db, 'serviceRequests', requestId);
    const updateData = {
        status,
        updatedAt: serverTimestamp(),
    };

    return updateDoc(docRef, updateData)
        .catch(async (serverError) => {
            console.error("Firestore error:", serverError);
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: updateData,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            throw permissionError;
        });
}

export function completeServiceRequest(db: Firestore, requestId: string, details: { cost: number; invoiceNotes?: string }) {
    const docRef = doc(db, 'serviceRequests', requestId);
    const updateData: { [key: string]: any } = {
        status: 'Completed',
        cost: details.cost,
        updatedAt: serverTimestamp(),
    };
    if (details.invoiceNotes) {
        updateData.invoiceNotes = details.invoiceNotes;
    }

    return updateDoc(docRef, updateData)
        .catch(async (serverError) => {
            console.error("Firestore error:", serverError);
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: updateData,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            throw permissionError;
        });
}
