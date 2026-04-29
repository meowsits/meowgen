const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
  // 1. The Secret Handshake (CORS Headers)
  // This tells Netlify it is safe to talk to your GitHub Pages site
  const headers = {
    'Access-Control-Allow-Origin': 'https://meowsits.github.io', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 2. The Browser Pre-flight Check
  // Browsers send a quiet 'OPTIONS' ping before the real 'POST' message to check security
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'Peace be with you.' };
  }

  // We only allow POST messages
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally.";
    const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    // We must include the headers when returning the final message
    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({ reply: response.text }),
    };
  } catch (error) {
    console.error("Zen mind interrupted:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '*Purr...* I am deep in meditation at the moment. Please try again soon.' }),
    };
  }
};
