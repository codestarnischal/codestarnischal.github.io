import { openDB, type DBSchema } from 'idb';
import type { Report } from '@/lib/types';

interface ScoutLensDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: { 'by-createdAt': string };
  };
}

const DB_NAME = 'scoutlens';
const DB_VERSION = 1;

export async function getDB() {
  return openDB<ScoutLensDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('reports', { keyPath: 'id' });
      store.createIndex('by-createdAt', 'createdAt');
    },
  });
}

export async function putReport(report: Report) {
  const db = await getDB();
  await db.put('reports', report);
}
export async function getAllReports(): Promise<Report[]> {
  const db = await getDB();
  return (await db.getAllFromIndex('reports', 'by-createdAt')).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}
export async function deleteReport(id: string) {
  const db = await getDB();
  await db.delete('reports', id);
}

export async function clearAll() {
  const db = await getDB();
  await db.clear('reports');
}