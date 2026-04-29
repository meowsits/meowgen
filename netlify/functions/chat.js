const fetch = require('node-fetch');

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
    const apiKey = process.env.GEMINI_API_KEY;

    // We speak directly to Google's API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Meowgen, a Zen cat chatbot inspired by Dogen. Speak with calm wisdom and koans. Purr occasionally.\n\nUser: ${userMessage}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    // Extract the text from Google's complex response package
    const aiText = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({ reply: aiText }),
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
