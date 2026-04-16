export const ADMIN_BACKEND_URL = "";

export const ADMIN_SESSION_URL = ADMIN_BACKEND_URL;

export function asList<T>(value: unknown, key?: string): T[] {
  if (Array.isArray(value)) return value as T[];
  if (key && value && typeof value === "object") {
    const candidate = (value as Record<string, unknown>)[key];
    return Array.isArray(candidate) ? (candidate as T[]) : [];
  }
  return [];
}
