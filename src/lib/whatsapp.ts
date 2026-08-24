import { Appointment } from '@/types';

/**
 * Normaliza y formatea el teléfono para enlaces directos de WhatsApp en México / Internacional
 */
export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `52${digits}`;
  }
  if (digits.startsWith('52') && digits.length === 12) {
    return digits;
  }
  return digits;
}

/**
 * Obtiene la URL base de la aplicación para enlaces en mensajes
 */
export function getAppBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://afinaciones-de-autor.vercel.app';
}

/**
 * Genera el enlace de WhatsApp para enviar la Cotización Dual al cliente
 */
export function getWhatsAppQuoteLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const serviceName =
    appointment.serviceDescription ||
    (appointment.packageType === 'afinacion_mayor'
      ? 'Afinación Mayor de Autor'
      : 'Mantenimiento Automotriz');

  const agencyPrice = appointment.quote?.agency.price
    ? `$${appointment.quote.agency.price.toLocaleString()} MXN`
    : 'Por definir';
  const premiumPrice = appointment.quote?.premium.price
    ? `$${appointment.quote.premium.price.toLocaleString()} MXN`
    : 'Por definir';

  const message = `¡Hola *${appointment.client.name.trim()}*! 🚗

Te compartimos la cotización personalizada de *Afinaciones de Autor* para tu *${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})* • Folio: *${appointment.folio}*.
📋 *Servicio:* ${serviceName}

Hemos preparado las opciones para tu atención a domicilio:

⭐ *1. ${appointment.quote?.agency.title || 'Opción Agencia'}*: ${agencyPrice}
• ${appointment.quote?.agency.partsBrand || 'Refacciones originales'}
• Póliza de garantía de ${appointment.quote?.agency.warrantyMonths || 6} meses

⚡ *2. ${appointment.quote?.premium.title || 'Opción De Autor'}*: ${premiumPrice}
• ${appointment.quote?.premium.partsBrand || 'Insumos de alto rendimiento'}
• Garantía extendida por escrito de ${appointment.quote?.premium.warrantyMonths || 12} meses

🔍 Puedes consultar el desglose y *aprobar tu servicio en 1-click* aquí:
👉 ${trackingUrl}

Quedamos atentos a cualquier duda o ajuste en tu fecha y horario preferido.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp para Confirmación Oficial de Cita al cliente
 */
export function getWhatsAppBookingConfirmationLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const message = `¡Hola *${appointment.client.name.trim()}*! 🚗✅

Tu cita de servicio con *Afinaciones de Autor* ha quedado *CONFIRMADA*.

📋 *Folio:* ${appointment.folio}
🚘 *Vehículo:* ${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year}) • Placas: ${appointment.vehicle.plates || 'S/P'}
📅 *Fecha:* ${appointment.scheduledDate}
🕒 *Horario de Visita:* ${appointment.timeSlot}
🧑‍🔧 *Técnico Asignado:* ${appointment.technicianName} ${appointment.technicianPhone ? '(' + appointment.technicianPhone + ')' : ''}
📍 *Dirección:* ${appointment.client.address}

🔍 Puedes ver los detalles y el estatus de tu unidad móvil en vivo aquí:
👉 ${trackingUrl}

¡Gracias por confiar en Afinaciones de Autor!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp cuando el técnico va en camino
 */
export function getWhatsAppEnRouteLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const message = `¡Hola *${appointment.client.name.trim()}*! 🚗💨

Tu técnico especialista de *Afinaciones de Autor* (${appointment.technicianName}) acaba de iniciar el traslado hacia tu domicilio.

📍 *Destino:* ${appointment.client.address}
🕒 *Tiempo Estimado de Llegada:* 25 - 35 minutos

🔍 Sigue la unidad móvil en vivo aquí:
👉 ${trackingUrl}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp cuando el servicio ha finalizado con Reporte Técnico
 */
export function getWhatsAppCompletedLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const message = `¡Hola *${appointment.client.name.trim()}*! 🚗🎉

El servicio de afinación para tu *${appointment.vehicle.brand} ${appointment.vehicle.model}* ha finalizado con éxito.

📄 Hemos emitido tu *Reporte Técnico Digital y Póliza de Garantía por Escrito*.

🔍 Puedes consultar y descargar tu reporte completo aquí:
👉 ${trackingUrl}

¡Gracias por elegir la precisión de Afinaciones de Autor!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
