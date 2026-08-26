import nodemailer from 'nodemailer';
import { Appointment, DualQuote } from '@/types';

const GMAIL_USER = process.env.GMAIL_USER || process.env.EMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || '';

export const isEmailConfigured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD.replace(/\s+/g, ''), // elimina espacios si pegan la clave de 16 letras con espacios
  },
});

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  return 'https://afinaciones-de-autor-three.vercel.app';
}

/**
 * Plantilla 1: Confirmación de Solicitud de Cotización Recibida
 */
export async function sendQuoteRequestEmail(appointment: Appointment) {
  if (!isEmailConfigured || !appointment.client.email) {
    console.log('Email no enviado: configuración no presente o email de cliente vacío.');
    return { success: false, reason: 'unconfigured' };
  }

  const trackingUrl = `${getBaseUrl()}/seguimiento/${appointment.id}`;

  const plainText = `Hola ${appointment.client.name},

Hemos recibido con éxito tu solicitud de afinación para tu ${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year}) con Folio ${appointment.folio}.

Placas: ${appointment.vehicle.plates || 'S/P'}
VIN: ${appointment.vehicle.vin}
Fecha tentativa: ${appointment.scheduledDate} (${appointment.timeSlot})
Dirección: ${appointment.client.address}

Nuestro equipo técnico está cotizando las refacciones por VIN. En unos momentos recibirás tu presupuesto por WhatsApp (${appointment.client.phone}) y por este medio.

Puedes consultar el estatus en vivo de tu solicitud en el siguiente enlace:
${trackingUrl}

Atentamente,
Afinaciones de Autor - Mecánica Especializada a Domicilio`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud Recibida - Afinaciones de Autor</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 25px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <tr>
            <td style="background-color: #08101E; padding: 30px 25px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #08101E; font-weight: 900; font-size: 16px; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; text-align: center; margin-bottom: 12px;">
                      AA
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                      AFINACIONES DE AUTOR
                    </h1>
                    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; font-family: monospace;">
                      Servicio Mecánico Especializado a Domicilio
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 25px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 24px; text-align: center;">
                      <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; font-family: monospace; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                        Folio de Solicitud
                      </span>
                      <strong style="font-size: 22px; font-weight: 900; color: #0f172a; font-family: monospace; letter-spacing: -0.5px;">
                        ${appointment.folio}
                      </strong>
                    </div>

                    <h2 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
                      ¡Hola ${appointment.client.name}! 🚗
                    </h2>
                    <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                      Hemos recibido con éxito tu solicitud para tu <strong>${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})</strong>. Nuestro equipo técnico especializado está cotizando manualmente las refacciones correspondientes al número de serie de tu auto (VIN: <strong style="font-family: monospace;">${appointment.vehicle.vin}</strong>).
                    </p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; padding: 18px; margin-bottom: 24px;">
                      <tr>
                        <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Vehículo:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; padding-bottom: 8px;">${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Placas:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; font-family: monospace; padding-bottom: 8px;">${appointment.vehicle.plates || 'S/P'}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Fecha Tentativa:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; font-family: monospace; padding-bottom: 8px;">${appointment.scheduledDate} (${appointment.timeSlot})</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b;"><strong>Dirección:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 600; color: #0f172a;">${appointment.client.address}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom: 25px;">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #08101E; color: #F59E0B; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 10px rgba(8, 16, 30, 0.2);">
                      🔍 Ver Estatus de tu Solicitud en Vivo
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
                    <p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.5;">
                      En unos momentos recibirás tu presupuesto por WhatsApp (${appointment.client.phone}) y podrás autorizar la opción que prefieras en 1-click.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 25px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                © 2026 Afinaciones de Autor • Taller Mecánico Móvil de Alto Rendimiento
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Afinaciones de Autor" <${GMAIL_USER}>`,
      replyTo: GMAIL_USER,
      to: appointment.client.email,
      bcc: GMAIL_USER,
      subject: `Solicitud Recibida: ${appointment.vehicle.brand} ${appointment.vehicle.model} • Folio ${appointment.folio}`,
      text: plainText,
      html,
    });

    console.log('Correo de solicitud enviado con éxito:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo vía Gmail:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Plantilla 2: Propuesta de Cotización Dual Lista para Autorizar
 */
export async function sendDualQuoteProposalEmail(appointment: Appointment, quote: DualQuote) {
  if (!isEmailConfigured || !appointment.client.email) {
    return { success: false, reason: 'unconfigured' };
  }

  const trackingUrl = `${getBaseUrl()}/seguimiento/${appointment.id}`;

  const plainText = `Hola ${appointment.client.name},

Tu cotización personalizada de Afinaciones de Autor para tu ${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year}) está lista con Folio ${appointment.folio}.

OPCIÓN 1: ${quote.agency.title} - $${quote.agency.price.toLocaleString()} MXN
- Refacciones originales de concesionaria
- Póliza de garantía de ${quote.agency.warrantyMonths} meses

OPCIÓN 2: ${quote.premium.title} - $${quote.premium.price.toLocaleString()} MXN
- Insumos de alto rendimiento (${quote.premium.partsBrand})
- Garantía extendida por escrito de ${quote.premium.warrantyMonths} meses

Puedes revisar el desglose y autorizar tu opción en 1-click en este enlace:
${trackingUrl}

Atentamente,
Afinaciones de Autor`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización Lista - Afinaciones de Autor</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 25px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <tr>
            <td style="background-color: #08101E; padding: 30px 25px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #08101E; font-weight: 900; font-size: 16px; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; text-align: center; margin-bottom: 12px;">
                AA
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">
                AFINACIONES DE AUTOR
              </h1>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; font-family: monospace;">
                Tu Cotización Personalizada por VIN está Lista
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 25px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; font-family: monospace; display: block; margin-bottom: 4px;">
                  Folio de Servicio
                </span>
                <strong style="font-size: 22px; font-weight: 900; color: #0f172a; font-family: monospace;">
                  ${appointment.folio}
                </strong>
              </div>

              <h2 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
                ¡Hola ${appointment.client.name}! 🚗
              </h2>
              <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Hemos preparado tu presupuesto detallado para tu <strong>${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})</strong>.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 18px; margin-bottom: 15px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; font-family: monospace;">Opción 1</span>
                      <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0;">${quote.agency.title}</h3>
                    </td>
                    <td align="right">
                      <strong style="font-size: 18px; font-weight: 900; color: #0f172a; font-family: monospace;">$${quote.agency.price.toLocaleString()} MXN</strong>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 12px; color: #64748b; margin: 8px 0 0 0;">
                  ${quote.agency.description} • Garantía por escrito de ${quote.agency.warrantyMonths} meses.
                </p>
              </div>

              <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="font-size: 10px; font-weight: 700; color: #d97706; text-transform: uppercase; font-family: monospace;">Opción 2 • Recomendada</span>
                      <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0;">${quote.premium.title}</h3>
                    </td>
                    <td align="right">
                      <strong style="font-size: 18px; font-weight: 900; color: #b45309; font-family: monospace;">$${quote.premium.price.toLocaleString()} MXN</strong>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 12px; color: #78350f; margin: 8px 0 0 0;">
                  ${quote.premium.description} • Garantía extendida de ${quote.premium.warrantyMonths} meses.
                </p>
              </div>

              <div style="text-align: center; padding-bottom: 20px;">
                <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #08101E; color: #F59E0B; font-weight: 800; font-size: 14px; text-decoration: none; padding: 15px 32px; border-radius: 14px; box-shadow: 0 4px 12px rgba(8, 16, 30, 0.25);">
                  ⚡ Ver Desglose y Autorizar Opción en 1-Click
                </a>
              </div>

              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                También puedes confirmar tu opción respondiendo al mensaje de WhatsApp que te enviamos.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 25px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                © 2026 Afinaciones de Autor • Taller Mecánico Móvil de Alto Rendimiento
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Afinaciones de Autor" <${GMAIL_USER}>`,
      replyTo: GMAIL_USER,
      to: appointment.client.email,
      bcc: GMAIL_USER,
      subject: `Presupuesto Listo: ${appointment.vehicle.brand} ${appointment.vehicle.model} • Folio ${appointment.folio}`,
      text: plainText,
      html,
    });

    console.log('Correo de cotización enviado con éxito:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de cotización:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Plantilla 3: Cita Confirmada Oficial con Técnico Asignado
 */
export async function sendBookingConfirmedEmail(appointment: Appointment) {
  if (!isEmailConfigured || !appointment.client.email) {
    return { success: false, reason: 'unconfigured' };
  }

  const trackingUrl = `${getBaseUrl()}/seguimiento/${appointment.id}`;

  const plainText = `¡Excelente ${appointment.client.name}!

Tu servicio de Afinación de Autor ha quedado CONFIRMADO con éxito para tu ${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year}) con Folio ${appointment.folio}.

📅 Fecha de Visita: ${appointment.scheduledDate}
🕒 Horario: ${appointment.timeSlot}
🧑‍🔧 Técnico Asignado: ${appointment.technicianName} ${appointment.technicianPhone ? '(' + appointment.technicianPhone + ')' : ''}
📍 Dirección de Atención: ${appointment.client.address}
💳 Forma de Pago: ${appointment.paymentMethod === 'online_card' ? 'Tarjeta en Línea (Pagado)' : 'En Sitio'}

El día del servicio podrás ver la ruta del técnico en vivo y la bitácora de fotos en este enlace:
${trackingUrl}

Atentamente,
Afinaciones de Autor`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cita Confirmada - Afinaciones de Autor</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 25px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #08101E; padding: 30px 25px; text-align: center;">
              <div style="display: inline-block; background: #10B981; color: #ffffff; font-weight: 900; font-size: 20px; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; text-align: center; margin-bottom: 12px;">
                ✓
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">
                CITA CONFIRMADA
              </h1>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; font-family: monospace;">
                Afinaciones de Autor • Servicio Móvil de Precisión
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 25px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; font-family: monospace; display: block; margin-bottom: 4px;">
                  Folio Confirmado
                </span>
                <strong style="font-size: 22px; font-weight: 900; color: #0f172a; font-family: monospace;">
                  ${appointment.folio}
                </strong>
              </div>

              <h2 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
                ¡Todo listo ${appointment.client.name}! 🚗
              </h2>
              <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Tu cita ha sido confirmada con éxito. Ya tenemos reservadas las refacciones para tu <strong>${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})</strong> y el técnico asignado acudirá a tu domicilio.
              </p>

              <!-- Tabla de Cita & Técnico -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; padding: 18px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Fecha del Servicio:</strong></td>
                  <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; font-family: monospace; padding-bottom: 8px;">${appointment.scheduledDate}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Horario de Visita:</strong></td>
                  <td align="right" style="font-size: 12px; font-weight: 700; color: #00509E; font-family: monospace; padding-bottom: 8px;">${appointment.timeSlot}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Técnico Asignado:</strong></td>
                  <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; padding-bottom: 8px;">${appointment.technicianName}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 8px;"><strong>Placas del Auto:</strong></td>
                  <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; font-family: monospace; padding-bottom: 8px;">${appointment.vehicle.plates || 'S/P'}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #64748b;"><strong>Dirección:</strong></td>
                  <td align="right" style="font-size: 12px; font-weight: 600; color: #0f172a;">${appointment.client.address}</td>
                </tr>
              </table>

              <!-- Botón CTA -->
              <div style="text-align: center; padding-bottom: 20px;">
                <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #08101E; color: #F59E0B; font-weight: 800; font-size: 14px; text-decoration: none; padding: 15px 32px; border-radius: 14px; box-shadow: 0 4px 12px rgba(8, 16, 30, 0.25);">
                  🔍 Ver Seguimiento en Vivo
                </a>
              </div>

              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                El día de tu servicio recibirás una alerta por WhatsApp en cuanto el técnico inicie su traslado a tu domicilio.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 25px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                © 2026 Afinaciones de Autor • Taller Mecánico Móvil de Alto Rendimiento
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Afinaciones de Autor" <${GMAIL_USER}>`,
      replyTo: GMAIL_USER,
      to: appointment.client.email,
      bcc: GMAIL_USER,
      subject: `Cita Confirmada: ${appointment.vehicle.brand} ${appointment.vehicle.model} • Folio ${appointment.folio}`,
      text: plainText,
      html,
    });

    console.log('Correo de confirmación de cita enviado con éxito:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de confirmación:', error);
    return { success: false, error: String(error) };
  }
}
