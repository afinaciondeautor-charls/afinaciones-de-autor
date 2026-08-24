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
  return 'http://192.168.100.192:3005';
}

/**
 * Genera el enlace de WhatsApp para enviar la Cotización Dual al cliente
 */
export function getWhatsAppQuoteLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const serviceName = appointment.serviceDescription || (appointment.packageType === 'afinacion_mayor' ? 'Afinación Mayor de Autor' : 'Mantenimiento Automotriz');

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

¡Quedamos a tus órdenes para atenderte en la puerta de tu casa! 🛠️`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp para avisar que el técnico va en camino
 */
export function getWhatsAppEnRouteLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const message = `¡Hola *${appointment.client.name.trim()}*! 🚗💨

Tu Master Tech de *Afinaciones de Autor* (*${appointment.technicianName || 'Pedro Almonte'}*) va en camino a tu domicilio en *${appointment.client.address}*.

⏱️ *Tiempo estimado de llegada:* 15 a 20 minutos.
📋 *Servicio programado:* Afinación de Autor a Domicilio (${appointment.vehicle.brand} ${appointment.vehicle.model}).

Puedes seguir el estatus de tu servicio en vivo aquí:
👉 ${trackingUrl}

¡Nos vemos en un momento! 🔧`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp para avisar que el servicio terminó y enviar el Reporte Técnico PDF
 */
export function getWhatsAppCompletedLink(appointment: Appointment): string {
  const phone = formatWhatsAppPhone(appointment.client.phone);
  const baseUrl = getAppBaseUrl();
  const trackingUrl = `${baseUrl}/seguimiento/${appointment.id}`;

  const message = `¡Hola *${appointment.client.name.trim()}*! ✅

El servicio de *Afinación de Autor* para tu *${appointment.vehicle.brand} ${appointment.vehicle.model}* ha finalizado con éxito en tu cochera.

📄 Tu *Reporte Técnico Oficial Certificado* con la bitácora de fotos antes/después y tu *Póliza de Garantía por Escrito* ya está disponible:
👉 ${trackingUrl}

¡Muchas gracias por confiar en Afinaciones de Autor! 🛠️⭐`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
