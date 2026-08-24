import { NextResponse } from 'next/server';
import { sendQuoteRequestEmail } from '@/lib/email';
import { Appointment } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const appointment: Appointment = body.appointment;

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment data required' }, { status: 400 });
    }

    const result = await sendQuoteRequestEmail(appointment);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Send Email error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
