/**
 * Utilidades para manejo y formato de fechas locales (Zona horaria de México / Dispositivo)
 * Evita el desfasamiento por UTC de new Date().toISOString()
 */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convierte YYYY-MM-DD a DD-MM-YYYY (ej. 2026-08-24 -> 24-08-2026)
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return 'Por definir';
  const clean = dateStr.slice(0, 10).replace(/\//g, '-');
  const parts = clean.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
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
