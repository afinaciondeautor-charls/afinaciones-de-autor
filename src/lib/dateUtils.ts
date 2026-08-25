/**
 * Utilidades para manejo de fechas locales (Zona horaria de México / Dispositivo)
 * Evita el desfasamiento por UTC de new Date().toISOString()
 */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getLocalDateString();
  return dateStr.slice(0, 10) === today;
}

export function isUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getLocalDateString();
  return dateStr.slice(0, 10) > today;
}

export function isPast(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getLocalDateString();
  return dateStr.slice(0, 10) < today;
}
