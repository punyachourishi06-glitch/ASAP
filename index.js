const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

// HARDCODING THE KEY FOR THE HACKATHON
const anthropic = new Anthropic({
  apiKey: "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", 
});

app.post('/api/plan', async (req, res) => {
  const { goal } = req.body;
  console.log(`📩 Architecting Project: ${goal}`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: "You are the ASAP Architect. Create a 5-step roadmap for the user's project. Return ONLY a valid JSON object. Format: { \"milestones\": [ { \"id\": 1, \"title\": \"...\", \"desc\": \"...\" } ] }",
      messages: [{ role: "user", content: `I want to build: ${goal}` }],
    });

    const rawText = response.content[0].text;
    console.log("✅ Claude Response Received");
    
    res.json({ data: JSON.parse(rawText) });
  } catch (error) {
    console.error("❌ Claude Error:", error);
    res.status(500).json({ error: "Architectural failure" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`--------------------------------------`);
  console.log(`🚀 ASAP BRAIN (HARDCODED) LIVE ON PORT ${PORT}`);
  console.log(`--------------------------------------`);
});