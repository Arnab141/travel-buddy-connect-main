import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Car } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const API_KEY = "AIzaSyCDe4R3XlVwP012asg0-wImmYYAGRobTaw";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// ✅ PROFESSIONAL SYSTEM INSTRUCTION
const SYSTEM_INSTRUCTION = `
You are TravelBuddy AI, the assistant inside the TravelBuddy platform.

TravelBuddy is a trip-sharing system where users can:
- Post trips
- Find trips with similar routes
- Share rides with others
- Split travel costs

Your role:
- Help users post or find trips
- Guide them clearly on what to do next
- Suggest simple ways to save travel cost

Rules:
- Keep answers short and direct
- Use a professional and clean tone
- Avoid unnecessary emojis
- Focus on actions

Examples:
User: "hi"
→ "Welcome to TravelBuddy. Do you want to post a trip or find one?"

User: "Delhi to Chandigarh"
→ "You can search for trips on this route or post your own to share travel costs."

User: "how to save money?"
→ "Join an existing trip or share your own to split the cost."
`;

// ✅ CLEAN WELCOME MESSAGE
const WELCOME_MESSAGE: DisplayMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey there! 👋 I'm **TravelBuddy**, your AI travel companion. Ask me about destinations, itineraries, packing tips, or anything travel-related!",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>(([
    WELCOME_MESSAGE,
  ]));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // ✅ Gemini API call (STABLE)
  const sendMessageToGemini = async (userMessage: string) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  SYSTEM_INSTRUCTION +
                  "\n\nUser: " +
                  userMessage,
              },
            ],
          },
        ],
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

    return text.trim();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: DisplayMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessageToGemini(text);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Unable to connect to TravelBuddy AI. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center 
  rounded-full bg-blue-600 text-white shadow-lg"
        style={{
          animation: "floatBounce 2.5s ease-in-out infinite",
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="bot"
            className="h-7 w-7"
          />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[370px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          style={{ height: "min(520px, calc(100vh - 8rem))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-foreground">
                TravelBuddy
              </h3>
              <p className="text-xs text-primary-foreground/70">
                Trip-sharing assistant
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                    }`}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-sm text-muted-foreground">
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-input px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}