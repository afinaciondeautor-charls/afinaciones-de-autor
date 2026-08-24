import nodemailer from 'nodemailer';
import { Appointment } from '@/types';

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
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://afinaciones-de-autor.vercel.app';
}

/**
 * Plantilla de Correo 1: Confirmación de Solicitud de Cotización Recibida
 */
export async function sendQuoteRequestEmail(appointment: Appointment) {
  if (!isEmailConfigured || !appointment.client.email) {
    console.log('Email no enviado: configuración no presente o email de cliente vacío.');
    return { success: false, reason: 'unconfigured' };
  }

  const trackingUrl = `${getBaseUrl()}/seguimiento/${appointment.id}`;

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
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header (Obsidian Navy) -->
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

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px 25px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                
                <!-- Saludo y Folio -->
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
                      Hemos recibido con éxito tu solicitud para tu <strong>${appointment.vehicle.brand} ${appointment.vehicle.model} (${appointment.vehicle.year})</strong>. Nuestro equipo técnico maestro está revisando la especificación exacta de refacciones e insumos de acuerdo al número de serie de tu auto (VIN: <strong style="font-family: monospace;">${appointment.vehicle.vin}</strong>).
                    </p>
                  </td>
                </tr>

                <!-- Ficha del Vehículo & Cita -->
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
                        <td style="font-size: 12px; color: #64748b;"><strong>Dirección de Atención:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 600; color: #0f172a;">${appointment.client.address}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Botón CTA -->
                <tr>
                  <td align="center" style="padding-bottom: 25px;">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #08101E; color: #F59E0B; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 10px rgba(8, 16, 30, 0.2);">
                      🔍 Ver Estatus de tu Solicitud en Vivo
                    </a>
                  </td>
                </tr>

                <!-- Nota informativa -->
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
      to: appointment.client.email,
      bcc: GMAIL_USER, // Te envía copia automática a ti
      subject: `🚘 Solicitud Recibida: ${appointment.vehicle.brand} ${appointment.vehicle.model} • Folio ${appointment.folio}`,
      html,
    });

    console.log('Correo enviado con éxito:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo vía Gmail:', error);
    return { success: false, error: String(error) };
  }
}
