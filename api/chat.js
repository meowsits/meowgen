export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "*The vault is locked. Check Vercel Environment Variables.*" });
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

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

    if (data.error) {
       console.error("Google says:", data.error.message);
       return res.status(data.error.code || 500).json({ reply: "*Google whispers:* " + data.error.message });
    }

    if (data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiText });
    }

    return res.status(500).json({ reply: "*The cat is silent. Check the logs.*" });

  } catch (error) {
    return res.status(500).json({ reply: "*The connection was lost in the mist.*" });
  }
}
