exports.handler = async function(event, context) {
  // A completely open handshake for testing
  const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
  };

  // Answer the browser's preflight scout
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'Peace be with you.' };
  }

  // A simple, guaranteed response
  return {
    statusCode: 200,
    headers, 
    body: JSON.stringify({ reply: "*Purr...* The bridge is perfectly open. I am not yet thinking deeply, but I can hear you." }),
  };
};
