
'use client';

import { addDoc, collection, doc, DocumentReference, Firestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { AddEmergencyAlert, EmergencyAlert, Vehicle, AddDriver } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Adds a new emergency alert to the 'emergencyAlerts' collection.
 *
 * @param db - The Firestore instance.
 * @param alertData - The data for the new emergency alert.
 */
export const addEmergencyAlert = (db: Firestore, alertData: AddEmergencyAlert) => {
  if (!db) {
    throw new Error('Firestore database instance is not available.');
  }
  
  const alertsCollection = collection(db, 'emergencyAlerts');
  
  const dataWithTimestamp = {
    ...alertData,
    createdAt: serverTimestamp()
  };
  
  addDoc(alertsCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: alertsCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

/**
 * Updates an existing emergency alert in the 'emergencyAlerts' collection.
 *
 * @param alertRef - The DocumentReference of the alert to update.
 * @param data - The data to update.
 */
export const updateEmergencyAlert = (alertRef: DocumentReference, data: Partial<EmergencyAlert>) => {
    updateDoc(alertRef, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: alertRef.path,
            operation: 'update',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};


/**
 * Adds a new vehicle to the 'vehicles' collection.
 *
 * @param db - The Firestore instance.
 * @param vehicleData - The data for the new vehicle.
 */
export const addVehicle = (db: Firestore, vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
  if (!db) {
    throw new Error('Firestore database instance is not available.');
  }
  
  const vehiclesCollection = collection(db, 'vehicles');
  
  const dataWithTimestamp = {
    ...vehicleData,
    createdAt: serverTimestamp()
  };
  
  addDoc(vehiclesCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: vehiclesCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

/**
 * Updates an existing vehicle in the 'vehicles' collection.
 *
 * @param db - The Firestore instance.
 * @param vehicleId - The ID of the vehicle to update.
 * @param vehicleData - The data to update.
 */
export const updateVehicle = (db: Firestore, vehicleId: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'createdAt'>>) => {
    if (!db) {
        throw new Error('Firestore database instance is not available.');
    }
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    updateDoc(vehicleRef, vehicleData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: vehicleRef.path,
            operation: 'update',
            requestResourceData: vehicleData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};

/**
 * Adds a new driver to the 'drivers' collection.
 *
 * @param db - The Firestore instance.
 * @param driverData - The data for the new driver.
 */
export const addDriver = (db: Firestore, driverData: AddDriver) => {
  if (!db) {
    throw new Error('Firestore database instance is not available.');
  }

  const driversCollection = collection(db, 'drivers');

  const dataWithTimestamp = {
    ...driverData,
    createdAt: serverTimestamp()
  };

  addDoc(driversCollection, dataWithTimestamp).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: driversCollection.path,
      operation: 'create',
      requestResourceData: dataWithTimestamp,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
