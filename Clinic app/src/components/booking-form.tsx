"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { bookAppointment, type BookingState } from "@/app/book/actions";

const initialState: BookingState = { ok: false, message: "" };
type Schedule = {
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
};

function dateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeSlots(schedule?: Schedule) {
  if (!schedule) return [];
  const [startHour, startMinute] = schedule.start_time
    .slice(0, 5)
    .split(":")
    .map(Number);
  const [endHour, endMinute] = schedule.end_time
    .slice(0, 5)
    .split(":")
    .map(Number);
  const slots: string[] = [];
  for (
    let value = startHour * 60 + startMinute;
    value + schedule.slot_minutes <= endHour * 60 + endMinute;
    value += schedule.slot_minutes
  ) {
    slots.push(
      `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`,
    );
  }
  return slots;
}

export function BookingForm({
  doctorId,
  schedules,
}: {
  doctorId: string;
  schedules: Schedule[];
}) {
  const [state, action, pending] = useActionState(
    bookAppointment,
    initialState,
  );
  const dates = useMemo(() => {
    const available: { value: string; label: string; weekday: number }[] = [];
    for (let offset = 0; offset < 21 && available.length < 10; offset++) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + offset);
      if (schedules.some((item) => item.weekday === date.getDay())) {
        available.push({
          value: dateValue(date),
          label: date.toLocaleDateString("en-PK", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          weekday: date.getDay(),
        });
      }
    }
    return available;
  }, [schedules]);
  const [selectedDate, setSelectedDate] = useState(dates[0]?.value ?? "");
  const selectedDay = dates.find((item) => item.value === selectedDate);
  const slots = timeSlots(
    schedules.find((item) => item.weekday === selectedDay?.weekday),
  );

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center shadow-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-600 text-2xl font-black text-white">
          ✓
        </span>
        <h3 className="mt-4 text-2xl font-black text-emerald-950">
          Appointment request submitted
        </h3>
        <p className="mt-2 leading-7 text-emerald-800">{state.message}</p>
        <Link href="/find-doctor" className="button-secondary mt-6">
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-4 rounded-3xl border border-teal-100 bg-white p-6 shadow-xl shadow-teal-950/5"
    >
      <input type="hidden" name="doctorId" value={doctorId} />
      {state.message && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"
        >
          {state.message}
        </p>
      )}
      {!dates.length && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          This doctor&apos;s schedule is not available yet.
        </p>
      )}
      <label className="form-label">
        Patient name
        <input
          className="field"
          name="patientName"
          minLength={2}
          maxLength={120}
          required
        />
      </label>
      <label className="form-label">
        Mobile number
        <input
          className="field"
          name="patientPhone"
          placeholder="0300-1234567"
          inputMode="tel"
          pattern="03[0-9]{2}-?[0-9]{7}"
          title="Enter a Pakistani mobile number like 0300-1234567"
          required
        />
      </label>
      <label className="form-label">
        Available date
        <select
          className="field"
          name="appointmentDate"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          required
        >
          {dates.map((date) => (
            <option value={date.value} key={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </label>
      <label className="form-label">
        Available time
        <select className="field" name="startTime" required>
          {slots.map((time) => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      <label className="form-label">
        Note <span className="font-normal text-slate-400">(optional)</span>
        <textarea
          className="field min-h-24 resize-y"
          name="note"
          maxLength={500}
        />
      </label>
      <button
        className="button-primary w-full"
        disabled={pending || !dates.length || !slots.length}
        type="submit"
      >
        {pending ? "Submitting request..." : "Request appointment"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Enter your mobile number like 0300-1234567. No account is required. By
        submitting, you agree to our{" "}
        <Link className="font-semibold underline" href="/privacy">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}
