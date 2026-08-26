import { Appointment } from '@/types';
import { formatDisplayDate } from '@/lib/dateUtils';

/**
 * Normaliza y formatea el teléfono para enlaces directos de WhatsApp en México / Internacional
 */
export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return '523300000000';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `52${digits}`;
  }
  if (digits.startsWith('52') && digits.length === 12) {
    return digits;
  }
  return digits || '523300000000';
}

/**
 * Obtiene la URL base de la aplicación para enlaces en mensajes
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Si estamos en localhost para desarrollo local, mantener localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin;
    }
    // Si es un preview URL de Vercel con hash interno, redirigir al dominio oficial de producción
    if (origin.includes('vercel.app')) {
      return 'https://afinaciones-de-autor-three.vercel.app';
    }
    return origin;
  }

  return 'https://afinaciones-de-autor-three.vercel.app';
}

/**
 * Helper para armar URL universal y compatible de WhatsApp
 */
function buildWhatsAppUrl(phone: string | undefined, text: string): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * Genera el enlace de WhatsApp para enviar la Cotización Dual al cliente
 */
export function getWhatsAppQuoteLink(appointment: Appointment): string {
  if (!appointment) return '#';
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id || ''}`;

  const clientName = (appointment.client?.name || 'Cliente').trim();
  const vehicleBrand = appointment.vehicle?.brand || 'Vehículo';
  const vehicleModel = appointment.vehicle?.model || '';
  const vehicleYear = appointment.vehicle?.year ? `(${appointment.vehicle.year})` : '';
  const folio = appointment.folio || 'ADA';

  const serviceName =
    appointment.serviceDescription ||
    (appointment.packageType === 'afinacion_mayor'
      ? 'Afinación Mayor de Autor'
      : 'Mantenimiento Automotriz');

  const agencyPrice = appointment.quote?.agency?.price
    ? `$${appointment.quote.agency.price.toLocaleString()} MXN`
    : 'Por definir';
  const premiumPrice = appointment.quote?.premium?.price
    ? `$${appointment.quote.premium.price.toLocaleString()} MXN`
    : 'Por definir';

  const message = `¡Hola *${clientName}*! 🚗

Te compartimos la cotización personalizada de *Afinaciones de Autor* para tu *${vehicleBrand} ${vehicleModel} ${vehicleYear}* • Folio: *${folio}*.
📋 *Servicio:* ${serviceName}

Hemos preparado las opciones para tu atención a domicilio:

⭐ *1. ${appointment.quote?.agency?.title || 'Opción Agencia'}*: ${agencyPrice}
• ${appointment.quote?.agency?.partsBrand || 'Refacciones originales'}
• Póliza de garantía de ${appointment.quote?.agency?.warrantyMonths || 6} meses

⚡ *2. ${appointment.quote?.premium?.title || 'Opción De Autor'}*: ${premiumPrice}
• ${appointment.quote?.premium?.partsBrand || 'Insumos de alto rendimiento'}
• Garantía extendida por escrito de ${appointment.quote?.premium?.warrantyMonths || 12} meses

🔍 Puedes consultar el desglose y *aprobar tu servicio en 1-click* aquí:
👉 ${trackingUrl}

Quedamos atentos a cualquier duda o ajuste en tu fecha y horario preferido.`;

  return buildWhatsAppUrl(appointment.client?.phone, message);
}

/**
 * Genera el enlace de WhatsApp para Confirmación Oficial de Cita al cliente
 */
export function getWhatsAppBookingConfirmationLink(appointment: Appointment): string {
  if (!appointment) return '#';
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id || ''}`;

  const clientName = (appointment.client?.name || 'Cliente').trim();
  const vehicleBrand = appointment.vehicle?.brand || 'Vehículo';
  const vehicleModel = appointment.vehicle?.model || '';
  const vehicleYear = appointment.vehicle?.year ? `(${appointment.vehicle.year})` : '';
  const plates = appointment.vehicle?.plates || 'S/P';
  const techName = appointment.technicianName || 'Técnico Asignado';
  const clientAddress = appointment.client?.address || 'Domicilio del cliente';

  const message = `¡Hola *${clientName}*! 🚗 ✅

Tu cita de servicio con *Afinaciones de Autor* ha quedado *CONFIRMADA*.

📋 *Folio:* ${appointment.folio || 'ADA'}
🚘 *Vehículo:* ${vehicleBrand} ${vehicleModel} ${vehicleYear} • Placas: ${plates}
📅 *Fecha:* ${formatDisplayDate(appointment.scheduledDate)}
⏰ *Horario de Visita:* ${appointment.timeSlot || 'Por definir'}
🔧 *Técnico Asignado:* ${techName} ${appointment.technicianPhone ? '(' + appointment.technicianPhone + ')' : ''}
📍 *Dirección:* ${clientAddress}

🔍 Puedes ver los detalles y el estatus de tu unidad móvil en vivo aquí:
👉 ${trackingUrl}

¡Gracias por confiar en Afinaciones de Autor!`;

  return buildWhatsAppUrl(appointment.client?.phone, message);
}

/**
 * Genera el enlace de WhatsApp cuando el técnico va en camino
 */
export function getWhatsAppEnRouteLink(appointment: Appointment): string {
  if (!appointment) return '#';
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id || ''}`;

  const clientName = (appointment.client?.name || 'Cliente').trim();
  const techName = appointment.technicianName || 'Técnico Especialista';
  const clientAddress = appointment.client?.address || 'tu domicilio';

  const message = `¡Hola *${clientName}*! 🚗 💨

Tu técnico especialista de *Afinaciones de Autor* (${techName}) acaba de iniciar el traslado hacia tu domicilio.

📍 *Destino:* ${clientAddress}
⏰ *Tiempo Estimado de Llegada:* 25 - 35 minutos

🔍 Sigue la unidad móvil en vivo aquí:
👉 ${trackingUrl}`;

  return buildWhatsAppUrl(appointment.client?.phone, message);
}

/**
 * Genera el enlace de WhatsApp cuando el trabajo físico ha terminado y está listo para revisión con el cliente
 */
export function getWhatsAppWorkFinishedReadyForReviewLink(appointment: Appointment): string {
  if (!appointment) return '#';
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id || ''}`;

  const clientName = (appointment.client?.name || 'Cliente').trim();
  const techName = appointment.technicianName || 'Técnico Especialista';
  const vehicleBrand = appointment.vehicle?.brand || 'Vehículo';
  const vehicleModel = appointment.vehicle?.model || '';

  const message = `¡Hola *${clientName}*! 🚗 🛠️

Tu técnico especialista (${techName}) ha concluido con éxito los trabajos de afinación en tu *${vehicleBrand} ${vehicleModel}*.

En este momento te mostraremos las refacciones sustituidas y el funcionamiento de tu motor para tu entera satisfacción y entrega oficial.

🔍 Puedes consultar el seguimiento en vivo aquí:
👉 ${trackingUrl}`;

  return buildWhatsAppUrl(appointment.client?.phone, message);
}

/**
 * Genera el enlace de WhatsApp cuando el servicio ha finalizado, firmado y cobrado con Reporte Técnico
 */
export function getWhatsAppCompletedLink(
  appointment: Appointment,
  paymentMethodLabel?: string
): string {
  if (!appointment) return '#';
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id || ''}`;

  const clientName = (appointment.client?.name || 'Cliente').trim();
  const vehicleBrand = appointment.vehicle?.brand || 'Vehículo';
  const vehicleModel = appointment.vehicle?.model || '';

  const price = appointment.selectedOption === 'agency'
    ? appointment.quote?.agency?.price
    : appointment.quote?.premium?.price;

  const priceText = price ? `$${price.toLocaleString()} MXN` : '';
  const methodText = paymentMethodLabel ? ` (${paymentMethodLabel})` : '';

  const message = `¡Hola *${clientName}*! 🚗 🎉

El servicio de afinación para tu *${vehicleBrand} ${vehicleModel}* ha finalizado y quedado *COBRADO Y CERTIFICADO* con éxito${priceText ? ' por ' + priceText + methodText : ''}.

📄 Hemos adjuntado tu *Reporte Técnico Digital con Firma de Satisfacción y Póliza de Garantía por Escrito*.

🔍 Puedes consultar y descargar tu reporte completo aquí:
👉 ${trackingUrl}

¡Gracias por elegir la precisión y calidad de Afinaciones de Autor!`;

  return buildWhatsAppUrl(appointment.client?.phone, message);
}
