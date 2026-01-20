"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const doctors = ["Dr. Sharma", "Dr. Patel", "Dr. Mehta"];
const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "05:00 PM"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello 👋 I’m the AI Front Desk. How can I assist you today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  async function sendMessage(text?: string) {
    const messageText = text ?? input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText })
    });

    const data = await res.json();

    if (data.intent === "BOOK_APPOINTMENT" && !showBooking) {
      setShowBooking(true);
      setBookingConfirmed(false);
      if (data.doctor) setSelectedDoctor(data.doctor);
    }

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply }
    ]);

    if (
      messageText.toLowerCase().includes("chest pain") ||
      messageText.toLowerCase().includes("emergency")
    ) {
      setShowEmergency(true);
    }

    setLoading(false);
  }

  /* -------- Guided booking prompts (NO DUPLICATES) -------- */

  useEffect(() => {
    if (showBooking && selectedDoctor && !selectedDate && !bookingConfirmed) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `✅ Appointment request noted for ${selectedDoctor}. Please select a preferred date and time below.`
        }
      ]);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (showBooking && selectedDoctor && selectedDate && !selectedTime && !bookingConfirmed) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "📅 Date selected. Please choose an available time slot."
        }
      ]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (showBooking && selectedDoctor && selectedDate && selectedTime && !bookingConfirmed) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "🕒 Time slot selected. Please confirm your appointment."
        }
      ]);
    }
  }, [selectedTime]);

  return (
    <main className={`min-h-screen flex items-center justify-center px-4 ${dark ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200"}`}>
      {showEmergency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600">🚨 Emergency</h2>
            <p className="mt-2 text-sm">
              Please call emergency services or visit the nearest hospital immediately.
            </p>
            <button onClick={() => setShowEmergency(false)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}

      <div className={`w-full max-w-md rounded-2xl shadow-2xl backdrop-blur-md flex flex-col ${dark ? "bg-slate-800/95 text-white" : "bg-blue-50/80 border border-blue-200"
}`}>
        <div className="flex justify-between px-4 py-3 bg-blue-600 text-white">
          <div>
            <h1 className="font-semibold">🏥 AI Front Desk</h1>
            <p className="text-xs">Hospital Assistance</p>
          </div>
          <button onClick={() => setDark(!dark)} className="text-xs bg-white/20 px-2 py-1 rounded">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "ml-auto bg-blue-600 text-white" : dark ? "bg-slate-700" : "bg-white/70 backdrop-blur-lg border border-blue-100"}`}>
              {msg.content}
            </div>
          ))}
        </div>

        {/* Doctor chips */}
        <div className="px-3 py-2 flex gap-2 flex-wrap">
          {doctors.map(d => (
            <button
              key={d}
              disabled={bookingConfirmed}
              onClick={() => {
                setSelectedDoctor(d);
                if (!showBooking) sendMessage(`I want to book an appointment with ${d}`);
              }}
              className={`text-xs border px-3 py-1 rounded-full ${selectedDoctor === d ? "bg-blue-600 text-white" : ""}`}
            >
              🧑‍⚕️ {d}
            </button>
          ))}
        </div>

        <div className="px-3 pb-2">
          <button
            disabled={bookingConfirmed}
            onClick={() => sendMessage("I want to book an appointment")}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            📅 Book Appointment
          </button>
        </div>

        {showBooking && !bookingConfirmed && (
  <div className="mx-3 my-2 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200">

    {/* Date Picker */}
    <div className="px-3 py-2">
      <p className="text-xs mb-1">Select Date</p>
      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border text-black"
      />
    </div>

    {/* Time Slots */}
    <div className="px-3 py-2">
      <p className="text-xs mb-1">Select Time Slot</p>
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map(time => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`text-xs py-2 rounded-lg border ${
              selectedTime === time
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>

    {/* Confirm Button */}
    <div className="px-3 pb-3">
      <button
        onClick={() => {
          if (!selectedDoctor || !selectedDate || !selectedTime) return;

          setMessages(prev => [
            ...prev,
            {
              role: "assistant",
              content: `✅ Your appointment with ${selectedDoctor} is confirmed on ${selectedDate} at ${selectedTime}.`
            }
          ]);

          setBookingConfirmed(true);
          setShowBooking(false);
        }}
        className="w-full bg-emerald-700 text-white py-2 rounded-lg"
      >
        ✅ Confirm Appointment
      </button>
    </div>

  </div>
)}


        <div className="border-t px-3 py-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} className="flex-1 rounded-xl px-3 py-2 text-black" placeholder="Type your message..." />
          <button onClick={() => sendMessage()} className="bg-blue-600 text-white px-4 rounded-xl">
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
