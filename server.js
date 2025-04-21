const express = require('express');
const { Groq } = require('groq-sdk'); 

const app = express();
const PORT = 3000;

// ⚠️ Hardcode your Groq API key here (only safe in private repos)
const groq = new Groq("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"); 

app.use(express.json());

const conversations = {};

app.post('/', async (req, res) => {
    try {
        const [username, message] = req.body;
        
        if (!conversations[username]) {
            conversations[username] = [
                {
                    role: "system",
                    content: `You're an assistant in a Roblox game. Player: ${username}. 
                    Keep responses short (under 150 chars). Be fun and helpful!`
                }
            ];
        }

        conversations[username].push({role: "user", content: message});

        const chatCompletion = await groq.chat.completions.create({
            messages: conversations[username],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 100
        });

        const botResponse = chatCompletion.choices[0]?.message?.content || "Oops, I glitched! Try again.";
        
        conversations[username].push({role: "assistant", content: botResponse});
        
        // Trim old messages to save memory
        if (conversations[username].length > 8) {
            conversations[username] = conversations[username].slice(-8);
        }

        res.status(200).send(botResponse);
        
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).send("Hey " + (username || "friend") + ", my circuits are fuzzy! 🌀 Try again later!");
    }
});

app.listen(PORT, () => console.log(`🚀 AI proxy running on port ${PORT}`));
