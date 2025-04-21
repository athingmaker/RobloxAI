import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, message } = req.body;
    const groq = new Groq(process.env.GROQ_API_KEY);
    
    // Conversation handling logic here
    const completion = await groq.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are a helpful assistant talking to ${username} in Roblox. Keep responses under 200 characters.`
      }, {
        role: "user",
        content: message
      }],
      model: "mixtral-8x7b-32768"
    });

    res.status(200).json({ response: completion.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ error: "AI service unavailable" });
  }
}
