export default async function handler(req, res) {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // The hidden key

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Meowgen, a Zen cat inspired by Dogen. Give short, wise advice. Purr occasionally.\n\nUser: ${message}` }] }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;

    res.status(200).json({ reply: aiText });
  } catch (error) {
    res.status(500).json({ reply: "*The mist is too thick to see through right now.*" });
  }
}
