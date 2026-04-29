export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Check if the key exists in the vault
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return res.status(500).json({ reply: "*Purr...* The gate is locked. (Missing API Key)" });
    }

    // 3. Talk to Google
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

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

    // 4. Handle the response from Google
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiText });
    } else {
      console.error("Google API Error:", data);
      return res.status(500).json({ reply: "*The cat is deep in silent meditation. (Google Error)*" });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "*The connection was lost in the garden. (Server Error)*" });
  }
}
