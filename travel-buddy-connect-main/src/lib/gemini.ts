const API_KEY = "AIzaSyCDe4R3XlVwP012asg0-wImmYYAGRobTaw";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const SYSTEM_INSTRUCTION = `You are TravelBuddy, a friendly and knowledgeable AI travel assistant. You help users plan trips, suggest destinations, recommend activities, provide travel tips, and answer travel-related questions. Be enthusiastic, warm, and concise. Use emojis sparingly but appropriately. If asked about non-travel topics, gently steer the conversation back to travel.`;

export async function sendMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const contents: ChatMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini API error:", err);
    throw new Error("API Error");
  }

  const data = await response.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Full response:", data);
    throw new Error("Empty response");
  }

  return text;
}