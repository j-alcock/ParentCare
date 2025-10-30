import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveItem<T>(key: string, value: T): Promise<void> {
  const json = JSON.stringify(value);
  await AsyncStorage.setItem(key, json);
}

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function updateList<T extends { id: string }>(key: string, updater: (items: T[]) => T[]): Promise<T[]> {
  const current = await getItem<T[]>(key, []);
  const next = updater(current);
  await saveItem<T[]>(key, next);
  return next;
}

