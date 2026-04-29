const { GoogleGenAI } = require("@google/genai");

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://meowsits.github.io', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'Peace be with you.' };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Direct initialization
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    
    // We call the model by passing the name directly into the method
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally.";
    const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    // Universal generation call
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Zen mind interrupted:", error);
    
    // Fallback for the "High Demand" 503 error or any other library hiccups
    return {
      statusCode: 200, 
      headers,
      body: JSON.stringify({ reply: "*Purr...* The digital garden is quite crowded right now. Please wait a moment and ask me again." }),
    };
  }
};
