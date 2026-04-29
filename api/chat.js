export default async function handler(req, res) {
  // 1. Only allow POST requests from your chat window
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Vercel Error: GEMINI_API_KEY is missing from Settings.");
      return res.status(500).json({ reply: "*The vault is locked. Please check the Vercel settings.*" });
    }

    // 2. The Stable 1.5 Flash Connection
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "You are Meowgen, a Zen cat inspired by Dogen. Give short, wise, feline-themed advice and koans. Purr occasionally.\n\nUser: " + message
          }]
        }]
      })
    });

    const data = await response.json();

    // 3. Handle Google's response
    if (data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiText });
    } else if (data.error) {
      console.error("Google Error:", data.error.message);
      return res.status(500).json({ reply: "*Google whispers:* " + data.error.message });
    }

    return res.status(500).json({ reply: "*The cat is silent. Try again in a moment.*" });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "*The connection was lost in the garden.*" });
  }
}
