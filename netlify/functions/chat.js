const GoogleAI = require("@google/genai");

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

    // We check if the library is nested or direct (handles different versions)
    const GenAIClass = GoogleAI.GoogleGenAI || GoogleAI;
    const genAI = new GenAIClass(process.env.GEMINI_API_KEY);
    
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
