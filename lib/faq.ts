// lib/faq.ts

export const FAQS = {
  visitingHours: "Visiting hours are from 10:00 AM to 8:00 PM every day.",
  location: "We are located at 123 Health Avenue, City Center.",
  departments: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Emergency Care"
  ]
};

export function getFaqResponse(message: string): string | null {
  const text = message.toLowerCase();

  if (text.includes("visiting hour") || text.includes("visiting time")) {
    return FAQS.visitingHours;
  }

  if (text.includes("location") || text.includes("address") || text.includes("where")) {
    return FAQS.location;
  }

  if (text.includes("department") || text.includes("specialties")) {
    return `We have the following departments: ${FAQS.departments.join(", ")}.`;
  }

  return null;
}
