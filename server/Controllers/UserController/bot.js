// Controllers/UserController/bot.js

const axios = require("axios");

const SYSTEM_INSTRUCTION = `
You are TravelBuddy AI.

Help users:
- Post trips
- Find trips
- Save money

Keep answers short and helpful.
`;

const getBotResponse = async (req, res) => {
  try {
    console.log("Received message:", req.body.message);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: SYSTEM_INSTRUCTION + "\n\nUser: " + message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const data = response.data;

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        message: "No response from Gemini",
        data,
      });
    }

    res.json({ reply: text.trim() });

  } catch (error) {
    console.error("AXIOS ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Server error",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { getBotResponse };