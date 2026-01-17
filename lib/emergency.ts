// lib/emergency.ts

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "can't breathe",
  "cannot breathe",
  "unconscious",
  "fainted",
  "severe bleeding",
  "heavy bleeding",
  "heart attack",
  "stroke",
  "severe pain"
];

export function isEmergency(message: string): boolean {
  const text = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => text.includes(keyword));
}

export function emergencyResponse(): string {
  return (
    "⚠️ This may be a medical emergency.\n\n" +
    "Please call your local emergency number or go to the nearest emergency room immediately.\n\n" +
    "This chat cannot assist with emergencies."
  );
}
