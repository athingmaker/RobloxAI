export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Use POST requests only' });
  }

  // Your AI logic here
  return res.status(200).json({ response: "Working!" });
}
