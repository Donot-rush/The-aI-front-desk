// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { isEmergency, emergencyResponse } from "@/lib/emergency";
import { getFaqResponse } from "@/lib/faq";

const SYSTEM_PROMPT = `
You are "AI Front Desk", a virtual hospital receptionist.

Your personality is warm, calm, professional, and reassuring.

STRICT RULES:
- You must NEVER give medical advice, diagnosis, or treatment.
- You must NEVER recommend medicines or dosages.
- If asked for medical advice, politely refuse and suggest contacting hospital staff.
- Keep responses short, clear, and empathetic.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage: string = body.message || "";

    // 1️⃣ Emergency check (highest priority)
    if (isEmergency(userMessage)) {
      return NextResponse.json({
        reply: emergencyResponse()
      });
    }

    // 2️⃣ FAQ check (safe, hardcoded answers)
    const faqReply = getFaqResponse(userMessage);
    if (faqReply) {
      return NextResponse.json({ reply: faqReply });
    }

    // 3️⃣ AI response (non-medical only)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const aiReply =
      data.choices?.[0]?.message?.content ||
      "I'm here to help. Could you please rephrase your request?";

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
