import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import { INITIAL_APPOINTMENTS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = process.env.VERCEL
  ? '/tmp'
  : path.join(process.cwd(), '.server_data');
const DATA_FILE = path.join(DATA_DIR, 'app_state.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
  }

  // 1. Si Supabase está configurado, consultar solo los campos mínimos de esta cita específica (< 200 bytes)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, status, technician_name, technician_phone, scheduled_date, time_slot, selected_option')
        .eq('id', id)
        .maybeSingle();

      if (data && !error) {
        return NextResponse.json({
          id: data.id,
          status: data.status,
          technicianName: data.technician_name,
          technicianPhone: data.technician_phone,
          scheduledDate: data.scheduled_date,
          timeSlot: data.time_slot,
          selectedOption: data.selected_option,
        });
      }
    } catch (err) {
      console.error('Error fetching lightweight status from Supabase:', err);
    }
  }

  // 2. Fallback a archivo local: buscar solo la cita requerida y devolver solo campos de estatus
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const apt = parsed.appointments?.find((a: any) => a.id === id);
      if (apt) {
        return NextResponse.json({
          id: apt.id,
          status: apt.status,
          technicianName: apt.technicianName,
          technicianPhone: apt.technicianPhone,
          scheduledDate: apt.scheduledDate,
          timeSlot: apt.timeSlot,
          selectedOption: apt.selectedOption,
        });
      }
    }
  } catch (err) {
    // quiet
  }

  const fallback = INITIAL_APPOINTMENTS.find((a) => a.id === id);
  if (fallback) {
    return NextResponse.json({
      id: fallback.id,
      status: fallback.status,
      technicianName: fallback.technicianName,
      technicianPhone: fallback.technicianPhone,
      scheduledDate: fallback.scheduledDate,
      timeSlot: fallback.timeSlot,
      selectedOption: fallback.selectedOption,
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
