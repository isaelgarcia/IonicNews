import { Storage } from '@ionic/storage';

const storage = new Storage();

export const initializeStorage = async () => {
  await storage.create();
};

export const getStorageInstance = () => storage;