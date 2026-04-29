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

    // Initialize the AI with your hidden key
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

    // Use the most compatible method to get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally.";
    const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Zen mind interrupted:", error);
    
    return {
      statusCode: 200, 
      headers,
      body: JSON.stringify({ reply: "*Purr...* The digital garden is quite crowded right now. Please wait a moment and ask me again." }),
    };
  }
};
