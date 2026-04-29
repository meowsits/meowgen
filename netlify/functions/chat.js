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

    // --- THE MASTER KEY LOGIC ---
    // We look for GoogleGenAI in three different possible locations
    const GenAIClass = GoogleAI.GoogleGenAI || (GoogleAI.default && GoogleAI.default.GoogleGenAI) || GoogleAI;
    const genAI = new GenAIClass(process.env.GEMINI_API_KEY);
    
    // We check if getGenerativeModel exists, if not, we try to find it
    const model = genAI.getGenerativeModel ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

    if (!model) {
        throw new Error("Could not find the generative model function.");
    }

    const systemInstruction = "You are Meowgen, a Zen cat chatbot inspired by the teachings of Dogen. You speak with calm, peaceful wisdom, offering short, feline-inspired koans and guidance on the present moment. Purr occasionally.";
    const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

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
