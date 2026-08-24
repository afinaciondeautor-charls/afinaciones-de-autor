import { NextResponse } from 'next/server';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULE_SETTINGS,
  INITIAL_SECURITY_SETTINGS,
} from '@/lib/mockData';
import {
  Appointment,
  BusinessScheduleSettings,
  NotificationLog,
  SecuritySettings,
} from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ServerState {
  appointments: Appointment[];
  notifications: NotificationLog[];
  scheduleSettings: BusinessScheduleSettings;
  securitySettings: SecuritySettings;
}

const DATA_DIR = path.join(process.cwd(), '.server_data');
const DATA_FILE = path.join(DATA_DIR, 'app_state.json');

function getInitialState(): ServerState {
  return {
    appointments: INITIAL_APPOINTMENTS,
    notifications: INITIAL_NOTIFICATIONS,
    scheduleSettings: INITIAL_SCHEDULE_SETTINGS,
    securitySettings: INITIAL_SECURITY_SETTINGS,
  };
}

let memoryState: ServerState = getInitialState();

function loadLocalState(): ServerState {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.appointments && parsed.scheduleSettings) {
        memoryState = {
          appointments: parsed.appointments,
          notifications: parsed.notifications || [],
          scheduleSettings: parsed.scheduleSettings,
          securitySettings: parsed.securitySettings || INITIAL_SECURITY_SETTINGS,
        };
        return memoryState;
      }
    }
  } catch (err) {
    console.error('Error loading local state file:', err);
  }
  return memoryState;
}

function saveLocalState(state: ServerState) {
  memoryState = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local state file:', err);
  }
}

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      const [aptsRes, notifsRes, schedRes, secRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('timestamp', { ascending: false }).limit(50),
        supabase.from('schedule_settings').select('*').eq('id', 'default_settings').maybeSingle(),
        supabase.from('security_settings').select('*').eq('id', 'default_security').maybeSingle(),
      ]);

      const appointments: Appointment[] = (aptsRes.data || []).map((row: any) => ({
        id: row.id,
        folio: row.folio,
        client: row.client,
        vehicle: row.vehicle,
        packageType: row.package_type,
        serviceDescription: row.service_description,
        selectedOption: row.selected_option,
        quote: row.quote,
        status: row.status,
        scheduledDate: row.scheduled_date,
        timeSlot: row.time_slot,
        technicianName: row.technician_name,
        technicianPhone: row.technician_phone,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        cancellationPolicyAccepted: row.cancellation_policy_accepted,
        cancellationFee: row.cancellation_fee,
        serviceRecord: row.service_record,
        nextFollowUpDate: row.next_follow_up_date,
        followUpStatus: row.follow_up_status,
        createdAt: row.created_at,
      }));

      const notifications: NotificationLog[] = notifsRes.data || [];
      const scheduleSettings: BusinessScheduleSettings = schedRes.data
        ? {
            workingDays: schedRes.data.working_days,
            slots: schedRes.data.slots,
            blockedDates: schedRes.data.blocked_dates || [],
          }
        : INITIAL_SCHEDULE_SETTINGS;

      const securitySettings: SecuritySettings = secRes.data
        ? {
            adminPin: secRes.data.admin_pin || '123456',
            technicianPin: secRes.data.technician_pin || '123456',
            staffMembers: secRes.data.staff_members || [],
          }
        : INITIAL_SECURITY_SETTINGS;

      return NextResponse.json({
        appointments,
        notifications,
        scheduleSettings,
        securitySettings,
      });
    } catch (err) {
      console.error('Supabase fetch failed, falling back to local:', err);
    }
  }

  const localState = loadLocalState();
  return NextResponse.json(localState);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      try {
        if (body.appointments && Array.isArray(body.appointments)) {
          // Upsert all appointments
          const aptsRows = body.appointments.map((a: Appointment) => ({
            id: a.id,
            folio: a.folio,
            client: a.client,
            vehicle: a.vehicle,
            package_type: a.packageType,
            service_description: a.serviceDescription,
            selected_option: a.selectedOption,
            quote: a.quote,
            status: a.status,
            scheduled_date: a.scheduledDate,
            time_slot: a.timeSlot,
            technician_name: a.technicianName,
            technician_phone: a.technicianPhone,
            payment_method: a.paymentMethod,
            payment_status: a.paymentStatus,
            cancellation_policy_accepted: a.cancellationPolicyAccepted,
            cancellation_fee: a.cancellationFee,
            service_record: a.serviceRecord,
            next_follow_up_date: a.nextFollowUpDate,
            follow_up_status: a.followUpStatus,
            created_at: a.createdAt,
          }));

          if (aptsRows.length > 0) {
            await supabase.from('appointments').upsert(aptsRows);
          }
        }

        if (body.scheduleSettings) {
          await supabase.from('schedule_settings').upsert({
            id: 'default_settings',
            working_days: body.scheduleSettings.workingDays,
            slots: body.scheduleSettings.slots,
            blocked_dates: body.scheduleSettings.blockedDates,
            updated_at: new Date().toISOString(),
          });
        }

        if (body.securitySettings) {
          await supabase.from('security_settings').upsert({
            id: 'default_security',
            admin_pin: body.securitySettings.adminPin,
            technician_pin: body.securitySettings.technicianPin,
            staff_members: body.securitySettings.staffMembers,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (sbErr) {
        console.error('Supabase write error:', sbErr);
      }
    }

    const currentLocal = loadLocalState();
    const updatedState: ServerState = {
      appointments: body.appointments || currentLocal.appointments,
      notifications: body.notifications || currentLocal.notifications,
      scheduleSettings: body.scheduleSettings || currentLocal.scheduleSettings,
      securitySettings: body.securitySettings || currentLocal.securitySettings,
    };

    saveLocalState(updatedState);
    return NextResponse.json({ success: true, state: updatedState });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
