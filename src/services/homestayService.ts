/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const homestayService = {
  // Properties
  getProperties: (callback: (data: any[]) => void) => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'properties'), where('ownerId', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'properties'));
  },

  addProperty: async (data: any) => {
    try {
      return await addDoc(collection(db, 'properties'), {
        ...data,
        ownerId: auth.currentUser?.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'properties');
    }
  },

  // Rooms
  getRooms: (propertyId: string, callback: (data: any[]) => void) => {
    const q = collection(db, 'properties', propertyId, 'rooms');
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, `properties/${propertyId}/rooms`));
  },

  addRoom: async (propertyId: string, data: any) => {
    try {
      return await addDoc(collection(db, 'properties', propertyId, 'rooms'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `properties/${propertyId}/rooms`);
    }
  },

  // Bookings
  getBookings: (propertyId: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, 'bookings'), where('propertyId', '==', propertyId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'bookings'));
  },

  addBooking: async (data: any) => {
    try {
      return await addDoc(collection(db, 'bookings'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  }
};
