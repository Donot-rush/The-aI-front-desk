export const FAQS = {
  visitingHours: "Visiting hours are from 10:00 AM to 8:00 PM every day.",
  location: "We are located at 123 Health Avenue, City Center Bengaluru.",
  departments: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Emergency Care"
  ]
};

export function getFaqResponse(text: string): string | null {
  // Visiting hours
  if (
    text.includes("visiting hours") ||
    text.includes("visiting hour") ||
    text.includes("visiting time")
  ) {
    return "🏥 Visiting hours are from 10 AM to 6 PM daily.";
  }

  // Location / Address
  if (
    text.includes("location") ||
    text.includes("address") ||
    text.includes("where")
  ) {
    return "📍 We are located at Main Road, City Center Bengaluru.";
  }

  // Contact / Phone number
  if (
    text.includes("contact") ||
    text.includes("contact number") ||
    text.includes("phone") ||
    text.includes("phone number") ||
    text.includes("call")
  ) {
    return "☎️ You can contact us at +91-9876543210.";
  }

  // Departments / Specialties
  if (
    text.includes("department") ||
    text.includes("departments") ||
    text.includes("specialties")
  ) {
    return `We have the following departments: Cardiology, Neurology, Orthopedics, Pediatrics.`;
  }

  return null;
}
