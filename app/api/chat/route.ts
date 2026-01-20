import { NextRequest, NextResponse } from "next/server";
import { isEmergency, emergencyResponse } from "@/lib/emergency";
import { getFaqResponse } from "@/lib/faq";

const SYSTEM_PROMPT = `
You are "AI Front Desk", a virtual hospital receptionist.

Your role:
- Act as the FIRST point of contact for hospital visitors.
- Be warm, calm, professional, and reassuring.
- Help with hospital information and appointment booking ONLY.

STRICT SAFETY RULES:
- NEVER provide medical advice, diagnosis, or treatment.
- NEVER recommend medicines or tests.
- If severe symptoms appear, treat as EMERGENCY and stop normal flow.

APPOINTMENT BOOKING:
- Multi-step: Doctor → Date → Time → Confirmation
- Never assume missing details
- Supported doctors: Dr. Sharma, Dr. Patel, Dr. Mehta

OUTPUT JSON ONLY:
{
  "reply": string,
  "intent": "NONE" | "BOOK_APPOINTMENT" | "EMERGENCY",
  "doctor": string | null
}
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const text = message.toLowerCase();

    /* ---------------- EMERGENCY ---------------- */
    if (isEmergency(text)) {
      return NextResponse.json({
        reply: emergencyResponse(),
        intent: "EMERGENCY",
        doctor: null
      });
    }

    /* ---------------- FAQ ---------------- */
    const faq = getFaqResponse(text);
    if (faq) {
      return NextResponse.json({
        reply: faq,
        intent: "NONE",
        doctor: null
      });
    }

    /* ---------------- OPENAI ---------------- */
    if (!process.env.OPENAI_API_KEY) {
      // 🔒 Hard fallback if key is missing
      return NextResponse.json({
        reply:
          "✅ Appointment request noted. Please select a doctor, date, and time below to proceed.",
        intent: "BOOK_APPOINTMENT",
        doctor: null
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Chat API error:", error);

    /* ---------------- SAFE FALLBACK ---------------- */
    return NextResponse.json({
      reply:
        "✅ I can help you book an appointment. Please select a doctor, date, and time below to confirm.",
      intent: "BOOK_APPOINTMENT",
      doctor: null
    });
  }
}
