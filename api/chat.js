export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // We ask Google for the full list of available models
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + apiKey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // We send the list back to your browser
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the map: " + error.message });
  }
}
