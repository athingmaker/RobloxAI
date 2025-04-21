const express = require('express');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = 3000;
const groq = new Groq(process.env.GROQ_API_KEY);

app.use(express.json());

// Store conversations
const conversations = {};

app.post('/', async (req, res) => {
    try {
        const [username, message] = req.body;
        
        // Initialize conversation if new player
        if (!conversations[username]) {
            conversations[username] = [
                {
                    role: "system",
                    content: `You are a helpful assistant in a Roblox game. The player's username is ${username}. 
                    Keep responses under 200 characters. Be friendly and game-oriented.`
                }
            ];
        }

        // Add user message
        conversations[username].push({role: "user", content: message});

        // Get response from GroqAI
        const chatCompletion = await groq.chat.completions.create({
            messages: conversations[username],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 150
        });

        const botResponse = chatCompletion.choices[0]?.message?.content || "I didn't get that.";
        
        // Add AI response to conversation history
        conversations[username].push({role: "assistant", content: botResponse});

        // Clean up old messages to prevent memory issues
        if (conversations[username].length > 10) {
            conversations[username] = conversations[username].slice(-10);
        }

        res.status(200).send(botResponse);
        
    } catch (error) {
        console.error("GroqAI Error:", error);
        res.status(500).send("Hey " + (username || "player") + ", the AI is taking a break. Try again soon!");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
