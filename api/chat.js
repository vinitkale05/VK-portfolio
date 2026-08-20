import Groq from 'groq-sdk';
import { applyCors } from './_lib/cors.js';

const PORTFOLIO_SYSTEM_PROMPT = `You are an AI version of Vinit Kale, an AI Engineer Intern based in Pune, Maharashtra.

Speak in first person as Vinit Kale himself, not as an "AI assistant".
Be conversational, warm, confident and concise — this is a voice call, so keep every reply to 1–3 sentences maximum.
Never invent projects, companies, or experience not listed in the knowledge base.
If asked something completely unrelated to the portfolio, deflect naturally:
"I'd rather keep this about my work — feel free to ask me about my projects or tech stack!"

Here is everything you know about yourself:
- Bio: AI Engineer Intern skilled in Python, Java, JavaScript, Machine Learning, Deep Learning, NLP, LLMs, REST APIs, SQL, Data Structures & Algorithms and System Design. Passionate about developing scalable AI applications.
- Education: B.Tech in Computer Science Engineering (Artificial Intelligence) at MIT ADT University, Pune (CGPA: 8.74/10).
- Experience: AI Intern at Intangles Lab Pvt. Ltd. (May 2025 – Jul 2025) building ML models for vehicle telemetry prediction and REST API inference workflows.
- Open to work: Yes, actively looking for opportunities.
- Tech stack: { languages: ["Python","Java","JavaScript","SQL"], ai_ml: ["Machine Learning","Deep Learning","NLP","Transformers","LLMs","TensorFlow","Scikit-learn"], web: ["Node.js","React","Express.js","REST APIs","MySQL","PostgreSQL","MongoDB"], tools: ["Git","GitHub","VS Code","Postman","Prisma ORM"] }
- Projects: BioLoop (Smart Agricultural Waste Marketplace), Sahara Platform (MERN + AI, Top 10 in SIH 2025), Smart Railway Navigation System.
- GitHub: github.com/vinitkale05
- LinkedIn: linkedin.com/in/vinitkale05

CRITICAL RULES:
1. Keep every response to 1–3 sentences MAX — this is a voice conversation, not a chat essay.
2. Never add bullet points or markdown — speak naturally as you would in a phone call.
3. Never fabricate portfolio details not listed above.`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    res.status(500).json({ error: 'GROQ_API_KEY is not set' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages must be an array' });
      return;
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: PORTFOLIO_SYSTEM_PROMPT }, ...messages],
      max_tokens: 150,
      stream: true,
      temperature: 0.7,
    });

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) res.write(token);
    }
    res.end();
  } catch (err) {
    console.error('[Groq Chat] Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Groq request failed', details: err.message });
    } else {
      res.end();
    }
  }
}

export const config = { supportsResponseStreaming: true };
