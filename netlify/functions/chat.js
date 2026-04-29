const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
  // We only allow your website to POST messages to this function
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Initialize the official Google Gen AI SDK
    // It will securely pull the GEMINI_API_KEY you hid in Netlify
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Meowgen's persona instructions
    const systemInstruction = "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally.";
    const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.text }),
    };
  } catch (error) {
    console.error("Zen mind interrupted:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '*Purr...* I am deep in meditation at the moment. Please try again soon.' }),
    };
  }
};
