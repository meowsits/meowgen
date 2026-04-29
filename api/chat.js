export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    // 2. Safely get the message (handles case where body might be empty)
    const message = req.body && req.body.message ? req.body.message : "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "*Purr...* The vault is empty. Check Vercel Environment Variables." });
    }

    // 3. Use the 'Latest' alias from your successful ListModels call
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + apiKey;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "You are Meowgen, a Zen cat inspired by Dogen. Give short, wise, feline-themed advice. Purr occasionally.\n\nUser: " + message
          }]
        }]
      })
    });

    const data = await response.json();

    // 4. Handle Google's response or potential errors
    if (data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiText });
    } else {
      const errorMsg = data.error ? data.error.message : "The cat is in silent meditation.";
      return res.status(500).json({ reply: "*Google whispers:* " + errorMsg });
    }

  } catch (error) {
    // This catches local code crashes
    return res.status(500).json({ reply: "*The connection was lost in the mist: " + error.message + "*" });
  }
}
