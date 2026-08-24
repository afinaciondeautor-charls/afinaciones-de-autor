import { NextResponse } from 'next/server';
import { sendQuoteRequestEmail, sendDualQuoteProposalEmail } from '@/lib/email';
import { Appointment, DualQuote } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body.type || 'quote_request';
    const appointment: Appointment = body.appointment;
    const quote: DualQuote = body.quote || appointment?.quote;

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment data required' }, { status: 400 });
    }

    if (type === 'dual_quote_proposal' && quote) {
      const result = await sendDualQuoteProposalEmail(appointment, quote);
      return NextResponse.json(result);
    }

    const result = await sendQuoteRequestEmail(appointment);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Send Email error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
