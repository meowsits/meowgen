const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://meowsits.github.io', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'Peace be with you.' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Using gemini-1.5-flash as it is the most stable and fast version
    const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally."
    });

    const result = await model.generateContent(userMessage);
    const responseText = result.response.text();

    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({ reply: responseText }),
    };
  } catch (error) {
    console.error("Zen mind interrupted:", error);
    
    // If Google is busy (503), we show a specific message, otherwise a general one
    let errorMessage = "*Purr...* I am deep in meditation. Please wait a moment and ask again.";
    
    return {
      statusCode: 200, 
      headers,
      body: JSON.stringify({ reply: errorMessage }),
    };
  }
};
