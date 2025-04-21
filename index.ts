// /api/index.js
export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Use POST requests only' });
  }

  try {
    const body = JSON.parse(req.body); // Vercel sometimes wraps the body
    const { username, message } = body;
    
    // Simple rate limiter
    const now = Date.now();
    if (global.lastRequest && (now - global.lastRequest < 1000)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    global.lastRequest = now;

    const response = "Simulated response (rate limited)";
    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
