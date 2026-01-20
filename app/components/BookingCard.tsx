"use client";

import { useState } from "react";

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "2:00 PM",
  "4:30 PM",
];

export default function BookingCard({
  selectedDoctor,
  onConfirm,
}: {
  selectedDoctor: string | null;
  onConfirm: (details: {
    doctor: string;
    time: string;
    name: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="border-t bg-white px-4 py-4 space-y-4">
      <h3 className="font-semibold text-slate-800">
        📅 Book Appointment
      </h3>

      {/* Doctor */}
      <div className="text-sm text-slate-600">
        <strong>Doctor:</strong>{" "}
        {selectedDoctor ?? "Please select a doctor"}
      </div>

      {/* Patient Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Patient name"
        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Time Slots */}
      <div className="flex flex-wrap gap-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => setTime(slot)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              time === slot
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      <button
        disabled={!name || !time || !selectedDoctor}
        onClick={() =>
          onConfirm({
            doctor: selectedDoctor!,
            time: time!,
            name,
          })
        }
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-50"
      >
        ✅ Confirm Appointment
      </button>
    </div>
  );
}
